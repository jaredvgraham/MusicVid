import React from "react";

const FxBeams = ({
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
        height: `${designH * 0.35}px`,
        background: `radial-gradient(ellipse at center, 
          rgba(255,255,255,${0.1 + 0.4 * intensity}) 0%, 
          rgba(255,255,255,${0.02 + 0.15 * intensity}) 40%, 
          rgba(0,0,0,0) 70%)`,
        filter: `blur(${8 + intensity * 20}px)`,
        opacity: 0.3 + 0.7 * intensity,
      }}
    />
  );
};

export default FxBeams;
