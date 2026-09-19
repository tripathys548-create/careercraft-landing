export default function Container({
  className = "",
  size = "default", // 'small' | 'default' | 'large' | 'narrow'
  children,
  ...props
}) {
  const sizeClasses = {
    narrow: "max-w-3xl",
    small: "max-w-4xl",
    default: "max-w-6xl",
    large: "max-w-7xl",
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size] || sizeClasses.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
