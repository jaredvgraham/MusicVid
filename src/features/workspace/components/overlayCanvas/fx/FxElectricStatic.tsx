import React from "react";

const FxElectricStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const boltCount = Math.floor(3 + intensity * 5);

  // Fixed electric bolt positions for consistent rendering
  const boltPositions = [
    { x: 30, y: 20, height: 35, rotation: -10, opacity: 0.8 },
    { x: 70, y: 15, height: 45, rotation: 15, opacity: 0.7 },
    { x: 25, y: 60, height: 30, rotation: -5, opacity: 0.9 },
    { x: 75, y: 55, height: 40, rotation: 8, opacity: 0.6 },
    { x: 40, y: 80, height: 25, rotation: -12, opacity: 0.8 },
    { x: 60, y: 10, height: 50, rotation: 20, opacity: 0.7 },
    { x: 20, y: 40, height: 35, rotation: -8, opacity: 0.9 },
    { x: 80, y: 70, height: 30, rotation: 12, opacity: 0.6 },
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
        overflow: "hidden",
      }}
    >
      {boltPositions.slice(0, boltCount).map((bolt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${bolt.x}%`,
            top: `${bolt.y}%`,
            width: "2px",
            height: `${bolt.height}px`,
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,${0.2 + 0.8 * intensity}) 0%, 
              rgba(0,255,255,${0.1 + 0.7 * intensity}) 50%, 
              rgba(0,100,255,${0.05 + 0.6 * intensity}) 100%)`,
            transform: `rotate(${bolt.rotation}deg)`,
            filter: "blur(1px)",
            opacity: bolt.opacity * (0.6 + intensity * 0.4),
          }}
        />
      ))}
    </div>
  );
};

export default FxElectricStatic;
