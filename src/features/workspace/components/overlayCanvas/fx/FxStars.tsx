import React from "react";

const FxStars = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const starCount = Math.floor(20 + intensity * 30);

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
        overflow: "visible",
      }}
    >
      {Array.from({ length: starCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${
              0.8 + Math.random() * 0.2
            }) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)`,
            borderRadius: "50%",
            animation: `twinkle ${
              1.5 + Math.random() * 2.5
            }s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: `0 0 ${
              3 + Math.random() * 8
            }px rgba(255, 255, 255, 0.6)`,
          }}
        />
      ))}
    </div>
  );
};

export default FxStars;
