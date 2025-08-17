import React from "react";

const GodRays = ({
  preset,
  designW,
  designH,
}: {
  preset: any;
  designW: number;
  designH: number;
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
        background:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.22) 6%, rgba(255,255,255,0.00) 10%, rgba(255,255,255,0.00) 18%)",
        filter: "blur(24px)",
        opacity: 0.85,
        pointerEvents: "none",
      }}
    />
  );
};

export default GodRays;
