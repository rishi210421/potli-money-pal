export function Logo({
  size = 96,
  withWordmark = false,
  className = "",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/images/potli-logo.png"
      alt="Potli"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}