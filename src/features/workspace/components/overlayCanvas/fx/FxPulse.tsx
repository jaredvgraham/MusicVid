import React from "react";

const FxPulse = ({
  designW,
  designH,
  speed = 2,
}: {
  designW: number;
  designH: number;
  speed?: number;
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
        animation: `pulse ${2 / speed}s ease-in-out infinite`,
        pointerEvents: "none",
      }}
    />
  );
};

export default FxPulse;
