import React from "react";

const FxElectric = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const boltCount = Math.floor(3 + intensity * 5);

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
      {Array.from({ length: boltCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
            width: "2px",
            height: `${20 + Math.random() * 40}px`,
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,${0.2 + 0.8 * intensity}) 0%, 
              rgba(0,255,255,${0.1 + 0.7 * intensity}) 50%, 
              rgba(0,100,255,${0.05 + 0.6 * intensity}) 100%)`,
            transform: `rotate(${-15 + Math.random() * 30}deg)`,
            animation: `electric ${
              0.5 + Math.random() * 1
            }s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FxElectric;
