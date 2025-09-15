import React from "react";

const FxHologramStatic = ({
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
        background: `repeating-linear-gradient(
          0deg,
          transparent 0px,
          rgba(0,255,255,${0.1 * intensity}) 1px,
          transparent 2px,
          transparent 8px
        )`,
        pointerEvents: "none",
        opacity: 0.4 + intensity * 0.4,
      }}
    />
  );
};

export default FxHologramStatic;
