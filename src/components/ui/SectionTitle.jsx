export default function SectionTitle({ children, className = "" }) {
  return (
    <p
      className={`
        px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted
        ${className}
      `}
    >
      {children}
    </p>
  );
}
