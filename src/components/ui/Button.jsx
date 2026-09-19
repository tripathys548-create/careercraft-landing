export default function Button({
  as = "button",
  variant = "primary", // 'primary' | 'secondary' | 'ghost' | 'accent'
  size = "md", // 'sm' | 'md' | 'lg'
  href,
  onClick,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs min-h-[36px]",
    md: "px-5 py-2.5 text-sm min-h-[44px]",
    lg: "px-6 py-3.5 text-base min-h-[48px]",
  };

  const variantClasses = {
    primary: "bg-accent text-white hover:bg-accent-hover active:translate-y-0.5 shadow-sm",
    secondary: "bg-surface text-ink border border-border hover:bg-bg active:translate-y-0.5 shadow-2xs",
    ghost: "text-muted hover:text-ink hover:bg-bg/60",
    accent: "bg-ink text-white hover:bg-ink/90 active:translate-y-0.5 shadow-sm",
  };

  const combined = `${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (as === "a" || href) {
    return (
      <a href={href} onClick={onClick} className={combined} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={combined} {...props}>
      {children}
    </button>
  );
}
