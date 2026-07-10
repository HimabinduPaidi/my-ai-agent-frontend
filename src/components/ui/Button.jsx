const variants = {
  primary:
    "bg-primary text-white border border-transparent hover:bg-primary-hover active:scale-[0.98] shadow-sm",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-background active:scale-[0.98] shadow-sm",
  danger:
    "bg-danger text-white border border-transparent hover:bg-red-600 active:scale-[0.98] shadow-sm",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:bg-background hover:text-text-primary active:scale-[0.98]",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2 rounded-xl",
  icon: "h-8 w-8 p-0 rounded-lg",
  iconLg: "h-9 w-9 p-0 rounded-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
        cursor-pointer
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
