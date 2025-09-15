import React from "react";

const FxPulseStatic = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW * 0.9}px`,
        height: `${designH * 0.4}px`,
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, transparent 70%)",
        filter: "blur(20px)",
        pointerEvents: "none",
        opacity: 0.4 + intensity * 0.4,
      }}
    />
  );
};

export default FxPulseStatic;
