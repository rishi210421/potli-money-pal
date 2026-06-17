import logo from "./potli-logo.png";

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
      src={logo}
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