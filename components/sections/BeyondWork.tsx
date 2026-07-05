import { beyondWork } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/** A quiet tactical board: pitch, chalk lines, a 4-3-3 in formation dots.
 * Decorative only — hidden from assistive tech. */
function TacticalBoard() {
  const dots: [number, number][] = [
    // GK
    [24, 100],
    // back four
    [78, 34], [66, 78], [66, 122], [78, 166],
    // midfield three
    [130, 60], [118, 100], [130, 140],
    // front three
    [190, 44], [204, 100], [190, 156],
  ];
  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full h-auto rounded-lg"
      role="img"
      aria-hidden="true"
    >
      <rect width="300" height="200" fill="var(--pitch)" rx="8" />
      {/* chalk lines */}
      <g stroke="var(--paper)" strokeOpacity="0.45" strokeWidth="1.5" fill="none">
        <rect x="10" y="10" width="280" height="180" rx="2" />
        <line x1="150" y1="10" x2="150" y2="190" />
        <circle cx="150" cy="100" r="26" />
        <rect x="10" y="55" width="40" height="90" />
        <rect x="250" y="55" width="40" height="90" />
      </g>
      {/* formation */}
      <g fill="var(--paper)">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" />
        ))}
      </g>
    </svg>
  );
}

export function BeyondWork() {
  const { football, curiosity } = beyondWork;
  return (
    <section id="beyond" className="py-20 scroll-mt-16">
      <SectionHeading kicker="Beyond work" title="Off the clock." />
      <Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line overflow-hidden">
            <div className="p-6 pb-0">
              <TacticalBoard />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl text-ink">
                {football.heading}
              </h3>
              <p className="mt-3 text-ink-muted leading-relaxed">
                {football.body}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-paper-deep border border-line p-6 flex flex-col">
            <h3 className="font-display text-2xl text-ink">
              {curiosity.heading}
            </h3>
            <p className="mt-3 text-ink-muted leading-relaxed">
              {curiosity.body}
            </p>
            {curiosity.items.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {curiosity.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-xs text-pitch-deep bg-pitch-soft rounded-full px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
