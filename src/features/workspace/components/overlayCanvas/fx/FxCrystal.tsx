"use client";

interface FxCrystalProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxCrystal({
  designW,
  designH,
  intensity = 0.5,
}: FxCrystalProps) {
  const crystalCount = Math.floor(12 * intensity);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
      }}
    >
      {Array.from({ length: crystalCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 5}px`,
            height: `${3 + Math.random() * 5}px`,
            background: `linear-gradient(45deg, #ffffff 0%, #f0f8ff 25%, #e0f0ff 50%, #cce7ff 75%, #b3d9ff 100%)`,
            clipPath:
              "polygon(50% 0%, 0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%)",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2.5 + Math.random() * 2.5}s`,
            opacity: Math.max(0.8, intensity),
            boxShadow: `0 0 ${4 + intensity * 8}px #b3d9ff`,
          }}
        />
      ))}
    </div>
  );
}
