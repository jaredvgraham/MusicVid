import React from "react";

const FxFire = ({
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
        background: `radial-gradient(ellipse at center bottom, 
          rgba(255,100,0,${0.2 + 0.8 * intensity}) 0%, 
          rgba(255,50,0,${0.1 + 0.7 * intensity}) 30%, 
          rgba(255,0,0,${0.05 + 0.5 * intensity}) 60%, 
          transparent 100%)`,
        filter: `blur(${15 + intensity * 20}px)`,
        animation: `fire ${2 + Math.random()}s ease-in-out infinite`,
        pointerEvents: "none",
      }}
    />
  );
};

export default FxFire;
