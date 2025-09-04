import React from "react";

const GodRays = ({
  preset,
  designW,
  designH,
  intensity = 0.5,
}: {
  preset: any;
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
        transform: `translate(-50%, -50%) rotate(${
          preset.fxRayAngleDeg ?? 0
        }deg)`,
        width: `${designW}px`,
        height: `${designH * 0.5}px`,
        background: `repeating-linear-gradient(0deg, 
          rgba(255,255,255,${0.05 + 0.25 * intensity}) 0%, 
          rgba(255,255,255,${0.05 + 0.25 * intensity}) 6%, 
          rgba(255,255,255,0.00) 10%, 
          rgba(255,255,255,0.00) 18%)`,
        filter: `blur(${12 + intensity * 24}px)`,
        opacity: 0.3 + 0.7 * intensity,
        pointerEvents: "none",
      }}
    />
  );
};

export default GodRays;
