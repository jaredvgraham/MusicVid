"use client";

interface FxSparkleProps {
  designW: number;
  designH: number;
  intensity?: number;
}

export default function FxSparkle({
  designW,
  designH,
  intensity = 0.5,
}: FxSparkleProps) {
  const sparkleCount = Math.floor(intensity * 20);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        width: designW,
        height: designH,
      }}
    >
      {Array.from({ length: sparkleCount }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            background: `radial-gradient(circle, #ffffff 0%, #ffff00 50%, transparent 100%)`,
            borderRadius: "50%",
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
            opacity: Math.max(0.5, intensity),
            boxShadow: `0 0 ${5 + intensity * 10}px #ffffff`,
          }}
        />
      ))}
    </div>
  );
}
