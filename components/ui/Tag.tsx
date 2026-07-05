export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.7rem] leading-none text-ink-muted border border-line rounded-full px-2.5 py-1.5 whitespace-nowrap">
      {children}
    </span>
  );
}
