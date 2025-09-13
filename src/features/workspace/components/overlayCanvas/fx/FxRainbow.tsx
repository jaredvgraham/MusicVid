import React from "react";

const FxRainbow = ({
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
        background: `conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000)`,
        backgroundSize: "200% 200%",
        animation: `rainbow ${4 / speed}s linear infinite`,
        filter: "blur(15px)",
        opacity: 0.6,
        pointerEvents: "none",
      }}
    />
  );
};

export default FxRainbow;
