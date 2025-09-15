import React from "react";

const FxSmokeStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const smokeCount = Math.floor(5 + 10 * intensity);

  // Fixed smoke positions for consistent rendering
  const smokePositions = [
    { x: 25, y: 70, width: 30, height: 40, opacity: 0.6 },
    { x: 75, y: 65, width: 25, height: 35, opacity: 0.7 },
    { x: 30, y: 80, width: 35, height: 45, opacity: 0.5 },
    { x: 70, y: 75, width: 28, height: 38, opacity: 0.8 },
    { x: 20, y: 85, width: 32, height: 42, opacity: 0.6 },
    { x: 80, y: 70, width: 26, height: 36, opacity: 0.7 },
    { x: 35, y: 75, width: 29, height: 39, opacity: 0.5 },
    { x: 65, y: 80, width: 33, height: 43, opacity: 0.8 },
    { x: 15, y: 75, width: 27, height: 37, opacity: 0.6 },
    { x: 85, y: 85, width: 31, height: 41, opacity: 0.7 },
    { x: 40, y: 70, width: 28, height: 38, opacity: 0.5 },
    { x: 60, y: 75, width: 34, height: 44, opacity: 0.8 },
    { x: 22, y: 80, width: 26, height: 36, opacity: 0.6 },
    { x: 78, y: 70, width: 30, height: 40, opacity: 0.7 },
    { x: 32, y: 85, width: 27, height: 37, opacity: 0.5 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW}px`,
        height: `${designH * 0.6}px`,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {smokePositions.slice(0, smokeCount).map((smoke, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${smoke.x}%`,
            top: `${smoke.y}%`,
            width: `${smoke.width}px`,
            height: `${smoke.height}px`,
            background: `radial-gradient(ellipse, 
              rgba(200,200,200,${0.1 + intensity * 0.3}) 0%, 
              transparent 70%)`,
            filter: "blur(2px)",
            opacity: smoke.opacity * (0.4 + intensity * 0.4),
          }}
        />
      ))}
    </div>
  );
};

export default FxSmokeStatic;
