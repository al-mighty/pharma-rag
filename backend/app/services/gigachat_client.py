"""GigaChat API client — handles auth token and API calls."""
import time
import uuid

import httpx

from app.config import settings

_token: str | None = None
_token_expires: float = 0

AUTH_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
API_URL = "https://gigachat.devices.sberbank.ru/api/v1"


async def _get_token() -> str:
    """Get or refresh OAuth token."""
    global _token, _token_expires

    if _token and time.time() < _token_expires - 60:
        return _token

    async with httpx.AsyncClient(verify=False) as client:
        resp = await client.post(
            AUTH_URL,
            headers={
                "Authorization": f"Basic {settings.gigachat_auth_key}",
                "RqUID": str(uuid.uuid4()),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data={"scope": settings.gigachat_scope},
        )
        resp.raise_for_status()
        data = resp.json()
        _token = data["access_token"]
        _token_expires = data["expires_at"] / 1000  # ms -> sec
        return _token


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """Get embeddings via GigaChat Embeddings API."""
    token = await _get_token()
    async with httpx.AsyncClient(verify=False, timeout=60.0) as client:
        resp = await client.post(
            f"{API_URL}/embeddings",
            headers={"Authorization": f"Bearer {token}"},
            json={"model": settings.embedding_model, "input": texts},
        )
        resp.raise_for_status()
        data = resp.json()
        return [item["embedding"] for item in data["data"]]


async def embed_query(text: str) -> list[float]:
    """Embed a single query."""
    result = await embed_texts([text])
    return result[0]


async def chat_stream(messages: list[dict], system_prompt: str):
    """Stream chat completion from GigaChat. Yields text chunks."""
    token = await _get_token()

    all_messages = [{"role": "system", "content": system_prompt}] + messages

    async with httpx.AsyncClient(verify=False, timeout=120.0) as client:
        async with client.stream(
            "POST",
            f"{API_URL}/chat/completions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "model": settings.llm_model,
                "messages": all_messages,
                "stream": True,
            },
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line or not line.startswith("data: "):
                    continue
                payload = line[6:]
                if payload == "[DONE]":
                    break
                import json
                try:
                    data = json.loads(payload)
                    delta = data["choices"][0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        yield content
                except (json.JSONDecodeError, KeyError, IndexError):
                    continue
