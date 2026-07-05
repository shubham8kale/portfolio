export function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-pitch mb-3">
        {kicker}
      </p>
      <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-ink">
        {title}
      </h2>
    </div>
  );
}
