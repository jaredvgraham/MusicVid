import React from "react";

const FxGlow = ({
  designW,
  designH,
  color = "#ffffff",
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  color?: string;
  intensity?: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW * 0.8}px`,
        height: `${designH * 0.3}px`,
        background: `radial-gradient(ellipse at center, ${color}${Math.floor(
          0.3 * intensity * 255
        )
          .toString(16)
          .padStart(2, "0")} 0%, ${color}${Math.floor(0.1 * intensity * 255)
          .toString(16)
          .padStart(2, "0")} 50%, transparent 100%)`,
        filter: `blur(${15 + intensity * 10}px)`,
        opacity: intensity,
        pointerEvents: "none",
      }}
    />
  );
};

export default FxGlow;
