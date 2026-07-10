export default function Card({
  children,
  className = "",
  hover = false,
  padding = "p-5",
  ...props
}) {
  return (
    <div
      className={`
        bg-surface border border-border rounded-xl
        shadow-[var(--shadow-card)]
        ${hover ? "transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]" : ""}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
