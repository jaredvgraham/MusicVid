import React from "react";

const FxParticles = ({
  designW,
  designH,
  intensity = 0.5,
}: {
  designW: number;
  designH: number;
  intensity?: number;
}) => {
  const particleCount = Math.floor(10 + 40 * intensity);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: `${designW * 0.8}px`,
        height: `${designH * 0.6}px`,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            background: `radial-gradient(circle, rgba(255, 255, 255, ${
              0.3 + intensity * 0.7
            }) 0%, rgba(255, 255, 255, ${
              0.1 + intensity * 0.3
            }) 70%, transparent 100%)`,
            borderRadius: "50%",
            animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: `0 0 ${3 + intensity * 15}px rgba(255, 255, 255, ${
              0.3 + intensity * 0.4
            })`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FxParticles;
