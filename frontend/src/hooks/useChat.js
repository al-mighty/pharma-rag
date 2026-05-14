import { useCallback, useRef, useState } from "react";
import { fetchSSE } from "../api/client";
let msgIdCounter = 0;
function nextId() {
    return `msg-${++msgIdCounter}`;
}
export function useChat() {
    const [messages, setMessages] = useState([]);
    const [sources, setSources] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const conversationId = useRef(null);
    const sendMessage = useCallback(async (text) => {
        const userMsg = { id: nextId(), role: "user", content: text };
        const assistantMsg = { id: nextId(), role: "assistant", content: "", sources: [] };
        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setSources([]);
        setIsStreaming(true);
        try {
            await fetchSSE(text, conversationId.current, (srcs) => {
                const typedSources = srcs;
                setSources(typedSources);
                setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant")
                        last.sources = typedSources;
                    return updated;
                });
            }, (token) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant")
                        last.content += token;
                    return [...updated];
                });
            }, (data) => {
                conversationId.current = data.conversation_id;
            });
        }
        catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                    last.content = "Произошла ошибка. Попробуйте ещё раз.";
                }
                return updated;
            });
        }
        finally {
            setIsStreaming(false);
        }
    }, []);
    const clearChat = useCallback(() => {
        setMessages([]);
        setSources([]);
        conversationId.current = null;
    }, []);
    return { messages, sources, isStreaming, sendMessage, clearChat };
}
