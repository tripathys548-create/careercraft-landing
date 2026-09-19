export default function Section({
  id,
  className = "",
  background = "default", // 'default' | 'surface' | 'dark'
  children,
  ...props
}) {
  const bgClasses = {
    default: "bg-bg text-ink",
    surface: "bg-surface text-ink border-y border-border",
    dark: "bg-ink text-white",
  };

  return (
    <section
      id={id}
      className={`py-16 sm:py-24 ${bgClasses[background] || bgClasses.default} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
