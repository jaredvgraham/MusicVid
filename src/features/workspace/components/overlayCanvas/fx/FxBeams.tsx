import React from "react";

const FxBeams = ({
  designW,
  designH,
}: {
  designW: number;
  designH: number;
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
        background:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0) 70%)",
        filter: "blur(18px)",
        opacity: 0.9,
      }}
    />
  );
};

export default FxBeams;
