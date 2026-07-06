export type ChatMessage = { role: "user" | "assistant"; content: string };

export const MAX_TURNS = 8;
export const MAX_MESSAGE_CHARS = 1000;

/**
 * Parses and bounds an untrusted request body. Returns null when the shape is
 * wrong; otherwise a trimmed history capped server-side regardless of what the
 * client sent.
 */
export function validateBody(body: unknown): ChatMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_CHARS) return null;
    messages.push({ role, content: trimmed });
  }

  const recent = messages.slice(-MAX_TURNS);
  if (recent[recent.length - 1].role !== "user") return null;
  return recent;
}
