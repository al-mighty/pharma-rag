import json
from collections.abc import AsyncGenerator

import anthropic
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models import Conversation, Message
from app.prompts.templates import CONTEXT_TEMPLATE, SYSTEM_PROMPT
from app.services.vectorstore import search_similar

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    return _client


def build_context(sources: list[dict]) -> str:
    """Build context string from retrieved sources."""
    if not sources:
        return "No relevant documents found."

    parts = []
    for i, src in enumerate(sources, 1):
        parts.append(CONTEXT_TEMPLATE.format(
            index=i,
            drug_name=src["drug_name"],
            filename=src["filename"],
            page=src.get("page_number", "?"),
            content=src["content"],
        ))
    return "\n".join(parts)


async def get_conversation_history(db: AsyncSession, conversation_id) -> list[dict]:
    """Load last N messages from conversation for context."""
    from sqlalchemy import select

    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(10)
    )
    result = await db.execute(stmt)
    messages = list(reversed(result.scalars().all()))
    return [{"role": m.role, "content": m.content} for m in messages]


async def rag_stream(
    db: AsyncSession,
    user_message: str,
    conversation_id=None,
) -> AsyncGenerator[str, None]:
    """
    RAG pipeline: search → context → stream LLM response.
    Yields SSE-formatted events.
    """
    # 1. Retrieve relevant chunks
    sources = await search_similar(db, user_message)

    # Yield sources event
    yield f"event: sources\ndata: {json.dumps(sources, ensure_ascii=False)}\n\n"

    # 2. Build context
    context = build_context(sources)
    system_prompt = SYSTEM_PROMPT.format(context=context)

    # 3. Build message history
    messages = []
    if conversation_id:
        history = await get_conversation_history(db, conversation_id)
        messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    # 4. Stream LLM response
    client = _get_client()
    full_response = ""

    with client.messages.stream(
        model=settings.llm_model,
        max_tokens=2048,
        system=system_prompt,
        messages=messages,
    ) as stream:
        for text in stream.text_stream:
            full_response += text
            yield f"event: token\ndata: {json.dumps(text, ensure_ascii=False)}\n\n"

    # 5. Save to database
    if not conversation_id:
        conv = Conversation(title=user_message[:100])
        db.add(conv)
        await db.flush()
        conversation_id = conv.id

    # Save user message
    db.add(Message(
        conversation_id=conversation_id,
        role="user",
        content=user_message,
    ))

    # Save assistant message with sources
    db.add(Message(
        conversation_id=conversation_id,
        role="assistant",
        content=full_response,
        sources=sources,
    ))

    await db.commit()

    # Yield done event
    yield f"event: done\ndata: {json.dumps({'conversation_id': str(conversation_id)}, ensure_ascii=False)}\n\n"
