import React from "react";

const FxShimmerStatic = ({
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
        width: `${designW}px`,
        height: `${designH}px`,
        background: `linear-gradient(45deg, 
          transparent 30%, 
          rgba(255,255,255,${0.3 * intensity}) 50%, 
          transparent 70%)`,
        pointerEvents: "none",
        opacity: 0.6 + intensity * 0.4,
      }}
    />
  );
};

export default FxShimmerStatic;
