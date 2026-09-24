import { Fragment, type ReactNode } from "react";

/**
 * A deliberately tiny Markdown subset for bot replies: paragraphs, bullet and
 * numbered lists, **bold**, `code`, and auto-linked URLs and emails. Builds
 * React nodes directly - model output never reaches innerHTML.
 */

const INLINE =
  /(\*\*[^*\n]+\*\*|`[^`\n]+`|https?:\/\/[^\s)]+[^\s).,;:!?]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    if (part.startsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`")) {
      return (
        <code key={i} className="rounded bg-paper-deep px-1 py-0.5 font-mono text-[0.8em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const href = part.startsWith("http") ? part : `mailto:${part}`;
    return (
      <a
        key={i}
        href={href}
        target={part.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-pitch"
      >
        {part}
      </a>
    );
  });
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] };

const BULLET = /^\s*[-*•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const last = blocks[blocks.length - 1];
    if (line.trim() === "") {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    const kind = BULLET.test(line) ? "ul" : NUMBERED.test(line) ? "ol" : null;
    if (kind) {
      const item = line.replace(kind === "ul" ? BULLET : NUMBERED, "");
      if (last && last.type === kind) last.items.push(item);
      else blocks.push({ type: kind, items: [item] });
    } else if (last && last.type === "p") {
      last.lines.push(line.replace(/^#+\s*/, ""));
    } else {
      blocks.push({ type: "p", lines: [line.replace(/^#+\s*/, "")] });
    }
  }
  return blocks.filter((b) => (b.type === "p" ? b.lines.length > 0 : b.items.length > 0));
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-2.5">
      {parse(text).map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i}>
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {inline(line)}
                </Fragment>
              ))}
            </p>
          );
        }
        const List = block.type;
        return (
          <List
            key={i}
            className={`space-y-1 pl-5 ${List === "ul" ? "list-disc" : "list-decimal"} marker:text-pitch`}
          >
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
