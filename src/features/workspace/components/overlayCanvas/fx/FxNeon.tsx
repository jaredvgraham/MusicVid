"use client";

interface FxNeonProps {
  designW: number;
  designH: number;
  intensity?: number;
  color?: string;
}

export default function FxNeon({
  designW,
  designH,
  intensity = 0.5,
  color = "#00ffff",
}: FxNeonProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
        background: `radial-gradient(circle at 50% 50%, ${color}${Math.round(
          intensity * 255
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${color}${Math.round(intensity * 128)
          .toString(16)
          .padStart(2, "0")} 30%, transparent 70%)`,
        mixBlendMode: "screen",
        opacity: Math.max(0.3, intensity),
        filter: `blur(${5 + intensity * 10}px)`,
      }}
    />
  );
}
