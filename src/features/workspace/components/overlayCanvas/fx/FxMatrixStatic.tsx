import React from "react";

const FxMatrixStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const columnCount = Math.floor(10 + 20 * intensity);

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
            top: "0",
            width: "1px",
            height: "100%",
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              rgba(0,255,0,${0.1 + intensity * 0.4}) 50%, 
              transparent 100%)`,
            opacity: 0.6 + intensity * 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default FxMatrixStatic;
