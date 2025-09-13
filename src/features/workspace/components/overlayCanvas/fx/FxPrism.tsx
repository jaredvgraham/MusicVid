"use client";

interface FxPrismProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxPrism({
  designW,
  designH,
  intensity = 0.5,
}: FxPrismProps) {
  const prismCount = Math.floor(10 * intensity);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
      }}
    >
      {Array.from({ length: prismCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${5 + Math.random() * 8}px`,
            height: `${5 + Math.random() * 8}px`,
            background: `conic-gradient(from 0deg, #ff0000 0deg, #ff8000 60deg, #ffff00 120deg, #00ff00 180deg, #0080ff 240deg, #8000ff 300deg, #ff0000 360deg)`,
            borderRadius: "50%",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            opacity: Math.max(0.6, intensity),
            boxShadow: `0 0 ${6 + intensity * 12}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}
