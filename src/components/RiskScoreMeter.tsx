import { useEffect, useRef, useState } from "react";

interface RiskScoreMeterProps {
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  size?: number;
}

const RiskScoreMeter = ({ score, riskLevel, size = 180 }: RiskScoreMeterProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const animRef = useRef<number>(0);

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  const strokeColor = () => {
    switch (riskLevel) {
      case "LOW": return "hsl(142, 71%, 45%)";
      case "MEDIUM": return "hsl(36, 91%, 55%)";
      case "HIGH": return "hsl(0, 100%, 64%)";
      case "CRITICAL": return "hsl(0, 100%, 64%)";
    }
  };

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));
      if (t < 1) animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${riskLevel === "CRITICAL" ? "animate-pulse-glow" : ""}`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="hsl(240, 5%, 16%)"
            strokeWidth="8"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition: "stroke-dashoffset 1.2s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-fraud-text">{displayScore}</span>
          <span className="text-xs text-fraud-muted">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${
            riskLevel === "LOW" ? "bg-fraud-success/20 text-fraud-success" :
            riskLevel === "MEDIUM" ? "bg-fraud-warning/20 text-fraud-warning" :
            "bg-fraud-danger/20 text-fraud-danger"
          }`}
        >
          {riskLevel} RISK
        </span>
        <p className="text-xs text-fraud-muted mt-2">AI Confidence: 94%</p>
      </div>
    </div>
  );
};

export default RiskScoreMeter;
