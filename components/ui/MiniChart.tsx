import type { MetricChart } from "@/content/projects";

/**
 * A small picture of one metric, drawn under its number. Every figure it
 * draws comes from the metric's `chart` field, which mirrors the metric's own
 * value - it never introduces a new number.
 *
 * Marks follow one rule: the measured value is pitch green, anything it is
 * compared against (a "before", a control group, an empty track) is the muted
 * mark. Values are direct-labelled, so color never carries meaning alone.
 */

const W = 240;
const PAD = 6;
const INNER = W - PAD * 2;

const fmt = (n: number) => String(n);

/** Horizontal bar, square at the baseline, 4px rounded at the data end. */
function barPath(x0: number, x1: number, y: number, h: number) {
  const r = Math.min(4, h / 2, Math.max(0, x1 - x0));
  return `M${x0} ${y}H${x1 - r}Q${x1} ${y} ${x1} ${y + r}V${y + h - r}Q${x1} ${y + h} ${x1 - r} ${y + h}H${x0}Z`;
}

function ChangeChart({ from, to, max, better }: Extract<MetricChart, { kind: "change" }>) {
  const x = (v: number) => PAD + (v / max) * INNER;
  const fx = x(from);
  const tx = x(to);
  const summary = `Changed from ${fmt(from)} to ${fmt(to)} on a scale of 0 to ${fmt(max)} (${better} is better).`;
  return (
    <svg viewBox={`0 0 ${W} 46`} className="w-full max-w-[240px] font-mono" role="img" aria-label={summary}>
      <title>{summary}</title>
      {/* track */}
      <line x1={PAD} x2={W - PAD} y1={24} y2={24} stroke="var(--line)" strokeWidth={1} />
      {/* movement */}
      <line x1={fx} x2={tx} y1={24} y2={24} stroke="var(--pitch)" strokeWidth={2} strokeOpacity={0.45} />
      <circle cx={fx} cy={24} r={4.5} fill="var(--muted-mark)" stroke="var(--paper)" strokeWidth={2} />
      <circle cx={tx} cy={24} r={5.5} fill="var(--pitch)" stroke="var(--paper)" strokeWidth={2} />
      <text x={fx} y={12} textAnchor="middle" fontSize={10} fill="var(--ink-muted)">
        {fmt(from)}
      </text>
      <text x={tx} y={12} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--ink)">
        {fmt(to)}
      </text>
      <text x={PAD} y={42} fontSize={9} fill="var(--ink-muted)">
        0
      </text>
      <text x={W - PAD} y={42} textAnchor="end" fontSize={9} fill="var(--ink-muted)">
        {fmt(max)}
      </text>
    </svg>
  );
}

function VersusChart({
  value,
  baseline,
  valueLabel,
  baselineLabel,
  unit,
}: Extract<MetricChart, { kind: "versus" }>) {
  const max = Math.max(value, baseline);
  // A tiny value still gets a visible sliver.
  const len = (v: number) => Math.max(3, (v / max) * INNER);
  const summary = `${valueLabel}: ${fmt(value)}${unit}. ${baselineLabel}: ${fmt(baseline)}${unit}.`;
  const rows = [
    { label: valueLabel, v: value, fill: "var(--pitch)", y: 0, strong: true },
    { label: baselineLabel, v: baseline, fill: "var(--muted-mark)", y: 28, strong: false },
  ];
  return (
    <svg viewBox={`0 0 ${W} 54`} className="w-full max-w-[240px] font-mono" role="img" aria-label={summary}>
      <title>{summary}</title>
      {rows.map((row) => (
        <g key={row.label}>
          <text x={PAD} y={row.y + 10} fontSize={10} fill="var(--ink-muted)">
            {row.label}
          </text>
          <text
            x={W - PAD}
            y={row.y + 10}
            textAnchor="end"
            fontSize={10}
            fontWeight={row.strong ? 600 : 400}
            fill={row.strong ? "var(--ink)" : "var(--ink-muted)"}
          >
            {fmt(row.v)}
            {unit}
          </text>
          <path d={barPath(PAD, PAD + len(row.v), row.y + 15, 8)} fill={row.fill} />
        </g>
      ))}
    </svg>
  );
}

function MeterChart({ value, max }: Extract<MetricChart, { kind: "meter" }>) {
  const end = PAD + (value / max) * INNER;
  const summary = `${fmt(value)} on a scale of 0 to ${fmt(max)}.`;
  return (
    <svg viewBox={`0 0 ${W} 32`} className="w-full max-w-[240px] font-mono" role="img" aria-label={summary}>
      <title>{summary}</title>
      <rect x={PAD} y={6} width={INNER} height={8} rx={4} fill="var(--pitch-soft)" />
      <path d={barPath(PAD, end, 6, 8)} fill="var(--pitch)" />
      <text x={PAD} y={28} fontSize={9} fill="var(--ink-muted)">
        0
      </text>
      <text x={W - PAD} y={28} textAnchor="end" fontSize={9} fill="var(--ink-muted)">
        {fmt(max)}
      </text>
    </svg>
  );
}

export function MiniChart({ chart }: { chart: MetricChart }) {
  switch (chart.kind) {
    case "change":
      return <ChangeChart {...chart} />;
    case "versus":
      return <VersusChart {...chart} />;
    case "meter":
      return <MeterChart {...chart} />;
  }
}
