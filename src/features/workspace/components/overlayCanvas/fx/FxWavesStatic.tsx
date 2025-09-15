import React from "react";

const FxWavesStatic = ({
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
        height: `${designH * 0.6}px`,
        background: `repeating-linear-gradient(
          0deg,
          transparent 0px,
          rgba(0,255,255,${0.2 * intensity}) 1px,
          transparent 2px,
          transparent 20px
        )`,
        pointerEvents: "none",
        opacity: 0.7 + intensity * 0.3,
      }}
    />
  );
};

export default FxWavesStatic;
