import json
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Conversation, Message
from app.prompts.templates import CONTEXT_TEMPLATE, SYSTEM_PROMPT
from app.services.gigachat_client import chat_stream
from app.services.vectorstore import search_similar


def build_context(sources: list[dict]) -> str:
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
    # 1. Retrieve relevant chunks
    sources = await search_similar(db, user_message)

    yield f"event: sources\ndata: {json.dumps(sources, ensure_ascii=False)}\n\n"

    # 2. Build context and prompt
    context = build_context(sources)
    system_prompt = SYSTEM_PROMPT.format(context=context)

    # 3. Build message history
    messages = []
    if conversation_id:
        history = await get_conversation_history(db, conversation_id)
        messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    # 4. Stream LLM response via GigaChat
    full_response = ""

    async for token in chat_stream(messages, system_prompt):
        full_response += token
        yield f"event: token\ndata: {json.dumps(token, ensure_ascii=False)}\n\n"

    # 5. Save to database
    if not conversation_id:
        conv = Conversation(title=user_message[:100])
        db.add(conv)
        await db.flush()
        conversation_id = conv.id

    db.add(Message(conversation_id=conversation_id, role="user", content=user_message))
    db.add(Message(conversation_id=conversation_id, role="assistant", content=full_response, sources=sources))
    await db.commit()

    yield f"event: done\ndata: {json.dumps({'conversation_id': str(conversation_id)}, ensure_ascii=False)}\n\n"
