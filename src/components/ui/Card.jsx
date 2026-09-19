export default function Card({
  className = "",
  padding = "md", // 'none' | 'sm' | 'md' | 'lg'
  children,
  ...props
}) {
  const padClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-surface border border-border rounded-xl shadow-2xs ${padClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
