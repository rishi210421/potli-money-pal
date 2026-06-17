import logo from "./potli-logo.png";

export function Logo({ size = 96, withWordmark = false, className = "" }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
<img src="/potli-logo.png" alt="Potli" />
  );
}
