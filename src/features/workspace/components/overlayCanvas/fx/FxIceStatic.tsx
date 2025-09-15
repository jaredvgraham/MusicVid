import React from "react";

const FxIceStatic = ({
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
        width: `${designW * 0.8}px`,
        height: `${designH * 0.4}px`,
        background: `radial-gradient(ellipse at center, 
          rgba(173,216,230,${0.1 + 0.7 * intensity}) 0%, 
          rgba(135,206,250,${0.05 + 0.6 * intensity}) 30%, 
          rgba(70,130,180,${0.02 + 0.4 * intensity}) 60%, 
          transparent 100%)`,
        filter: `blur(${10 + intensity * 25}px)`,
        pointerEvents: "none",
        opacity: 0.5 + intensity * 0.5,
      }}
    />
  );
};

export default FxIceStatic;
