import React from "react";

const FxMatrix = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const columnCount = Math.floor(20 + intensity * 30);

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
      {Array.from({ length: columnCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i / columnCount) * 100}%`,
            top: "0%",
            width: "2px",
            height: "100%",
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(0,255,0,${0.3 * intensity}) 50%, 
              transparent 100%)`,
            animation: `matrix ${2 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FxMatrix;
