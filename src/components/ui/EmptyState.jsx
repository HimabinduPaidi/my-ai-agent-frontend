import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-4 px-6 py-8 ${className}`}
    >
      {Icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-background border border-border">
          <Icon size={22} className="text-text-muted" strokeWidth={1.5} />
        </div>
      )}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-[15px] font-semibold text-text-primary tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
