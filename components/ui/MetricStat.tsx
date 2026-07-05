"use client";

import { useEffect, useRef, useState } from "react";
import type { Metric } from "@/content/projects";

/** Splits "~67K" → { prefix: "~", num: 67, suffix: "K", decimals: 0 }. */
function parseValue(value: string) {
  const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, num: parseFloat(num), suffix, decimals };
}

/**
 * One metric, count-up on first view. The animation is presentation only —
 * the rendered end state is always exactly the `value` string from
 * content/projects.ts.
 */
export function MetricStat({ value, label, context }: Metric) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<string>(value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const parsed = parseValue(value);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!parsed || reduced) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setStarted(true);
        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = parsed.num * eased;
          setDisplay(
            `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`,
          );
          if (t < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <p className="font-mono text-4xl sm:text-5xl font-medium text-ink tabular-nums">
        {started ? display : value}
      </p>
      <p className="font-mono text-sm text-pitch mt-1.5">{label}</p>
      <p className="text-xs text-ink-muted mt-1 leading-relaxed">{context}</p>
    </div>
  );
}
