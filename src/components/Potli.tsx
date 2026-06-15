type Props = {
  size?: number;
  mood?: "happy" | "cheer" | "wave" | "think" | "sleep";
  className?: string;
};

// Cute money-bag mascot inspired by uploaded logo
export function Potli({ size = 120, mood = "happy", className = "" }: Props) {
  const eyeY = mood === "sleep" ? 86 : 84;
  const mouth =
    mood === "cheer"
      ? "M70 100 Q100 130 130 100"
      : mood === "think"
      ? "M82 108 Q100 100 118 108"
      : "M78 102 Q100 122 122 102";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-label="Potli mascot"
    >
      {/* Bills behind */}
      <g transform="translate(40 18) rotate(-12)">
        <rect width="56" height="36" rx="4" fill="#C8E69A" stroke="#205938" strokeWidth="3" />
        <circle cx="28" cy="18" r="8" fill="none" stroke="#205938" strokeWidth="2" />
      </g>
      <g transform="translate(96 14) rotate(8)">
        <rect width="56" height="36" rx="4" fill="#FBE112" stroke="#205938" strokeWidth="3" />
        <circle cx="28" cy="18" r="8" fill="none" stroke="#205938" strokeWidth="2" />
      </g>
      {/* Coins */}
      <circle cx="44" cy="64" r="9" fill="#FBE112" stroke="#205938" strokeWidth="2.5" />
      <circle cx="58" cy="58" r="7" fill="#FBE112" stroke="#205938" strokeWidth="2.5" />

      {/* Bag body */}
      <path
        d="M30 110 Q30 70 100 70 Q170 70 170 110 Q170 175 100 178 Q30 175 30 110 Z"
        fill="#7CA946"
        stroke="#205938"
        strokeWidth="5"
      />
      {/* Bag highlight */}
      <path
        d="M48 100 Q60 88 80 88"
        stroke="#A8D26A"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Yellow clasp */}
      <ellipse cx="100" cy="78" rx="44" ry="22" fill="#FBE112" stroke="#205938" strokeWidth="4" />
      {/* Eyes */}
      <ellipse cx="84" cy={eyeY} rx="6" ry={mood === "sleep" ? 1.2 : 7} fill="#1a3a26" />
      <ellipse cx="116" cy={eyeY} rx="6" ry={mood === "sleep" ? 1.2 : 7} fill="#1a3a26" />
      {mood !== "sleep" && (
        <>
          <circle cx="86" cy={eyeY - 2} r="1.8" fill="#fff" />
          <circle cx="118" cy={eyeY - 2} r="1.8" fill="#fff" />
        </>
      )}
      {/* Cheeks */}
      <circle cx="74" cy={eyeY + 12} r="4" fill="#F4A8A8" opacity="0.7" />
      <circle cx="126" cy={eyeY + 12} r="4" fill="#F4A8A8" opacity="0.7" />
      {/* Mouth */}
      <path d={mouth} stroke="#1a3a26" strokeWidth="4" fill="none" strokeLinecap="round" />
      {mood === "wave" && (
        <g transform="translate(150 120)" className="origin-bottom-left">
          <path d="M0 0 q14 -10 24 4 q-12 12 -24 -4 z" fill="#7CA946" stroke="#205938" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}
