export function Skeleton({ className = "" }) {
  return (
    <div
      className={`shimmer rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-3 py-2"
      role="status"
      aria-label="Assistant is typing"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background border border-border shrink-0">
        <div className="flex items-center gap-1">
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted block" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted block" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-text-muted block" />
        </div>
      </div>
      <span className="text-[13px] text-text-secondary font-medium">
        Thinking…
      </span>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-2" aria-hidden="true">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
