"use client";

interface FxFadeProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxFade({
  designW,
  designH,
  intensity = 0.5,
}: FxFadeProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none animate-fade"
      style={{
        width: designW,
        height: designH,
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${
          intensity * 0.2
        }) 0%, transparent 70%)`,
        mixBlendMode: "overlay",
        animationDuration: `${3 + intensity * 2}s`,
      }}
    />
  );
}
