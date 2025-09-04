import React from "react";

const FxLightning = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const boltCount = Math.floor(2 + intensity * 3);

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
            top: "0%",
            width: "3px",
            height: "100%",
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,${0.9 * intensity}) 0%, 
              rgba(255,255,255,${0.7 * intensity}) 20%, 
              rgba(0,255,255,${0.5 * intensity}) 40%, 
              rgba(0,100,255,${0.3 * intensity}) 60%, 
              transparent 100%)`,
            transform: `rotate(${-10 + Math.random() * 20}deg)`,
            animation: `lightning ${
              0.3 + Math.random() * 0.7
            }s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FxLightning;
