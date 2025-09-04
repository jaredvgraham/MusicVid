"use client";

interface FxBlurProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxBlur({
  designW,
  designH,
  intensity = 0.5,
}: FxBlurProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
        filter: `blur(${intensity * 10}px)`,
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${
          intensity * 0.1
        }) 0%, transparent 70%)`,
        mixBlendMode: "overlay",
      }}
    />
  );
}
