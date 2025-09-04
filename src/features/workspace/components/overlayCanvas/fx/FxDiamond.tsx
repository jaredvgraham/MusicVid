"use client";

interface FxDiamondProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxDiamond({
  designW,
  designH,
  intensity = 0.5,
}: FxDiamondProps) {
  const diamondCount = Math.floor(15 * intensity);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
      }}
    >
      {Array.from({ length: diamondCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            background: `linear-gradient(45deg, #ffffff 0%, #e6f3ff 25%, #b3d9ff 50%, #80bfff 75%, #4da6ff 100%)`,
            clipPath: "polygon(50% 0%, 0% 50%, 50% 100%, 100% 50%)",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: Math.max(0.7, intensity),
            boxShadow: `0 0 ${5 + intensity * 10}px #4da6ff`,
          }}
        />
      ))}
    </div>
  );
}
