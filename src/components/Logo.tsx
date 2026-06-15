import logoAsset from "@/assets/potli-logo.png.asset.json";

export function Logo({ size = 96, withWordmark = false, className = "" }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Potli"
      width={size}
      height={withWordmark ? size : size}
      style={{ width: size, height: "auto", objectFit: "contain" }}
      className={className}
    />
  );
}
