import React from "react";

const FxStarsStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const starCount = Math.floor(20 + 30 * intensity);

  // Fixed star positions for consistent rendering
  const starPositions = [
    { x: 15, y: 20, size: 3, opacity: 0.8 },
    { x: 85, y: 15, size: 2, opacity: 0.6 },
    { x: 25, y: 45, size: 4, opacity: 0.9 },
    { x: 75, y: 35, size: 2, opacity: 0.7 },
    { x: 10, y: 70, size: 3, opacity: 0.8 },
    { x: 90, y: 65, size: 2, opacity: 0.6 },
    { x: 50, y: 10, size: 3, opacity: 0.7 },
    { x: 30, y: 80, size: 2, opacity: 0.8 },
    { x: 70, y: 85, size: 4, opacity: 0.9 },
    { x: 5, y: 50, size: 2, opacity: 0.6 },
    { x: 95, y: 40, size: 3, opacity: 0.8 },
    { x: 40, y: 25, size: 2, opacity: 0.7 },
    { x: 60, y: 60, size: 3, opacity: 0.8 },
    { x: 20, y: 90, size: 2, opacity: 0.6 },
    { x: 80, y: 5, size: 4, opacity: 0.9 },
    { x: 45, y: 70, size: 2, opacity: 0.7 },
    { x: 55, y: 30, size: 3, opacity: 0.8 },
    { x: 35, y: 55, size: 2, opacity: 0.6 },
    { x: 65, y: 75, size: 3, opacity: 0.8 },
    { x: 12, y: 35, size: 2, opacity: 0.7 },
    { x: 88, y: 55, size: 4, opacity: 0.9 },
    { x: 22, y: 65, size: 2, opacity: 0.6 },
    { x: 78, y: 25, size: 3, opacity: 0.8 },
    { x: 8, y: 85, size: 2, opacity: 0.7 },
    { x: 92, y: 15, size: 3, opacity: 0.8 },
    { x: 38, y: 40, size: 2, opacity: 0.6 },
    { x: 62, y: 50, size: 4, opacity: 0.9 },
    { x: 18, y: 30, size: 2, opacity: 0.7 },
    { x: 82, y: 70, size: 3, opacity: 0.8 },
    { x: 48, y: 15, size: 2, opacity: 0.6 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW}px`,
        height: `${designH}px`,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {starPositions.slice(0, starCount).map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${
              0.6 + intensity * 0.4
            }) 0%, transparent 70%)`,
            borderRadius: "50%",
            boxShadow: `0 0 ${2 + intensity * 8}px rgba(255, 255, 255, ${
              0.5 + intensity * 0.3
            })`,
            opacity: star.opacity * (0.7 + intensity * 0.3),
          }}
        />
      ))}
    </div>
  );
};

export default FxStarsStatic;
