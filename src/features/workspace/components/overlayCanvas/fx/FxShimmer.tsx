import React from "react";

const FxShimmer = ({
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
        width: `${designW}px`,
        height: `${designH}px`,
        background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
        backgroundSize: "200% 200%",
        animation: `shimmer ${3 / speed}s ease-in-out infinite`,
        pointerEvents: "none",
        mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
        maskComposite: "subtract",
      }}
    />
  );
};

export default FxShimmer;
