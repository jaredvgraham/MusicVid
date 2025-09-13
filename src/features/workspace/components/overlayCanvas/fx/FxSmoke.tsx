import React from "react";

const FxSmoke = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const smokeCount = Math.floor(5 + intensity * 10);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW}px`,
        height: `${designH}px`,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {Array.from({ length: smokeCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${30 + Math.random() * 40}%`,
            top: `${60 + Math.random() * 30}%`,
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
            background: `radial-gradient(circle, rgba(200,200,200,${
              0.3 * intensity
            }) 0%, transparent 70%)`,
            filter: "blur(15px)",
            animation: `smoke ${4 + Math.random() * 4}s ease-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FxSmoke;
