const variants = {
  default: "bg-background text-text-secondary border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md
        text-[11px] font-medium border
        ${variants[variant] ?? variants.default}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
