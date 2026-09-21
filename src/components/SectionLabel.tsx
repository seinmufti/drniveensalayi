type SectionLabelProps = {
  children: string;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex shrink-0 items-center gap-3 px-6 pb-[3svh] ${className}`}>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
        {children}
      </span>
      <span className="h-px w-10 bg-accent/60" />
    </div>
  );
}
