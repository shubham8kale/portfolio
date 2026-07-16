import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/chat/prompt";
import { validateBody } from "@/lib/chat/validate";
import { checkRateLimit } from "@/lib/chat/ratelimit";

export const runtime = "nodejs";

// Groq is OpenAI-compatible; swapping provider later is a config change.
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

function json(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  // Cheap abuse friction, not a security boundary: browsers always send
  // Origin on POST; reject mismatches, allow curl/no-origin.
  const origin = request.headers.get("origin");
  if (origin) {
    const requestHost = request.headers.get("host");
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      return json(403, "Bad origin.");
    }
    if (requestHost !== originHost) return json(403, "Bad origin.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = validateBody(body);
  if (!messages) return json(400, "Invalid request.");

  if (!process.env.GROQ_API_KEY) {
    return json(
      503,
      "The chat isn't configured yet - email Shubham instead: 1842shubham@gmail.com",
    );
  }

  // Prefer x-real-ip: it's set by the platform (Vercel) and can't be supplied
  // by the client, unlike the leftmost x-forwarded-for entry on some hosts.
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  const limit = await checkRateLimit(ip);
  if (!limit.ok) {
    return json(
      429,
      limit.reason === "global"
        ? "The bot has hit its daily message budget - it resets tomorrow. The links above go straight to the human."
        : "That's a lot of questions at once - give it a few minutes and try again.",
    );
  }

  const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: GROQ_BASE_URL,
  });

  let stream;
  try {
    stream = await groq.chat.completions.create({
      model: MODEL,
      stream: true,
      temperature: 0.3,
      max_tokens: 600,
      messages: [{ role: "system", content: getSystemPrompt() }, ...messages],
    });
  } catch (err) {
    console.error("[chat] upstream error", err);
    return json(502, "The model is unavailable right now - try again shortly.");
  }

  // If the visitor closes the panel/tab mid-answer, stop consuming the
  // upstream stream instead of burning quota to completion.
  request.signal.addEventListener("abort", () => stream.controller.abort());

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          // Rule 8 asks the model to avoid em/en dashes; this makes it certain.
          const delta = chunk.choices[0]?.delta?.content?.replace(/[—–]/g, "-");
          if (delta) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: delta })}\n\n`),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        // A client disconnect surfaces here as an abort - that's not an error.
        if (!request.signal.aborted) {
          console.error("[chat] stream error", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "The stream dropped - try again." })}\n\n`,
            ),
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
