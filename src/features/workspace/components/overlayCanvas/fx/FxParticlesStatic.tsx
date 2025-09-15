import React from "react";

const FxParticlesStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const particleCount = Math.floor(10 + 40 * intensity);

  // Fixed particle positions for consistent rendering
  const particlePositions = [
    { x: 25, y: 30, size: 4, opacity: 0.7 },
    { x: 75, y: 25, size: 3, opacity: 0.6 },
    { x: 30, y: 60, size: 5, opacity: 0.8 },
    { x: 70, y: 50, size: 3, opacity: 0.7 },
    { x: 20, y: 80, size: 4, opacity: 0.6 },
    { x: 80, y: 75, size: 3, opacity: 0.8 },
    { x: 45, y: 20, size: 4, opacity: 0.7 },
    { x: 55, y: 85, size: 3, opacity: 0.6 },
    { x: 35, y: 45, size: 5, opacity: 0.8 },
    { x: 65, y: 35, size: 3, opacity: 0.7 },
    { x: 15, y: 55, size: 4, opacity: 0.6 },
    { x: 85, y: 65, size: 3, opacity: 0.8 },
    { x: 40, y: 70, size: 4, opacity: 0.7 },
    { x: 60, y: 15, size: 3, opacity: 0.6 },
    { x: 25, y: 90, size: 5, opacity: 0.8 },
    { x: 75, y: 10, size: 3, opacity: 0.7 },
    { x: 50, y: 40, size: 4, opacity: 0.6 },
    { x: 30, y: 25, size: 3, opacity: 0.8 },
    { x: 70, y: 60, size: 4, opacity: 0.7 },
    { x: 10, y: 40, size: 3, opacity: 0.6 },
    { x: 90, y: 30, size: 5, opacity: 0.8 },
    { x: 22, y: 70, size: 3, opacity: 0.7 },
    { x: 78, y: 45, size: 4, opacity: 0.6 },
    { x: 38, y: 15, size: 3, opacity: 0.8 },
    { x: 62, y: 80, size: 4, opacity: 0.7 },
    { x: 18, y: 50, size: 3, opacity: 0.6 },
    { x: 82, y: 20, size: 5, opacity: 0.8 },
    { x: 48, y: 55, size: 3, opacity: 0.7 },
    { x: 52, y: 25, size: 4, opacity: 0.6 },
    { x: 28, y: 35, size: 3, opacity: 0.8 },
    { x: 72, y: 70, size: 4, opacity: 0.7 },
    { x: 12, y: 65, size: 3, opacity: 0.6 },
    { x: 88, y: 40, size: 5, opacity: 0.8 },
    { x: 42, y: 80, size: 3, opacity: 0.7 },
    { x: 58, y: 10, size: 4, opacity: 0.6 },
    { x: 32, y: 60, size: 3, opacity: 0.8 },
    { x: 68, y: 30, size: 4, opacity: 0.7 },
    { x: 8, y: 25, size: 3, opacity: 0.6 },
    { x: 92, y: 75, size: 5, opacity: 0.8 },
    { x: 46, y: 45, size: 3, opacity: 0.7 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW * 0.8}px`,
        height: `${designH * 0.6}px`,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {particlePositions.slice(0, particleCount).map((particle, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${
              0.3 + intensity * 0.7
            }) 0%, rgba(255, 255, 255, ${
              0.1 + intensity * 0.3
            }) 70%, transparent 100%)`,
            borderRadius: "50%",
            boxShadow: `0 0 ${3 + intensity * 15}px rgba(255, 255, 255, ${
              0.3 + intensity * 0.4
            })`,
            opacity: particle.opacity * (0.6 + intensity * 0.4),
          }}
        />
      ))}
    </div>
  );
};

export default FxParticlesStatic;
