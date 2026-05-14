const BASE = "/pharma-rag/api";

export async function fetchSSE(
  message: string,
  conversationId: string | null,
  onSources: (sources: unknown[]) => void,
  onToken: (token: string) => void,
  onDone: (data: { conversation_id: string }) => void,
) {
  const resp = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });

  if (!resp.ok) throw new Error(`Chat failed: ${resp.status}`);

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let currentEvent = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (currentEvent === "sources") onSources(parsed);
          else if (currentEvent === "token") onToken(parsed);
          else if (currentEvent === "done") onDone(parsed);
        } catch {
          if (currentEvent === "token") onToken(data);
        }
      }
    }
  }
}

export async function fetchDocuments() {
  const resp = await fetch(`${BASE}/documents`);
  return resp.json();
}

export async function fetchHealth() {
  const resp = await fetch(`${BASE}/health`);
  return resp.json();
}