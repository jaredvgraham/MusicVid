"use client";

interface FxGlitterProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxGlitter({
  designW,
  designH,
  intensity = 0.5,
}: FxGlitterProps) {
  const glitterCount = Math.floor(25 * intensity);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
      }}
    >
      {Array.from({ length: glitterCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `radial-gradient(circle, #ffd700 0%, #ffed4e 50%, transparent 100%)`,
            borderRadius: "50%",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.8 + Math.random() * 1.5}s`,
            opacity: Math.max(0.6, intensity),
            boxShadow: `0 0 ${3 + intensity * 8}px #ffd700`,
          }}
        />
      ))}
    </div>
  );
}
