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
  // SSE state lives ACROSS chunks: a big payload (sources can be ~7KB) gets
  // split between TCP chunks and the matching `event: ...` line may have
  // arrived in a previous iteration. Resetting currentEvent per-chunk drops
  // those events silently — which is exactly the bug that left the
  // sources panel empty.
  let currentEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line === "") {
        // Blank line marks the end of one SSE event block — per spec we
        // dispatch + reset here. Our dispatch happens inline above, so
        // just clear the event name.
        currentEvent = "";
      } else if (line.startsWith("event: ")) {
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