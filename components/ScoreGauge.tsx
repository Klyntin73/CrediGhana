
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade }) => {
  const percentage = (score - 300) / (850 - 300);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - percentage * circumference;

  const getColor = () => {
    if (score >= 750) return '#10b981'; // Green
    if (score >= 650) return '#3b82f6'; // Blue
    if (score >= 550) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="40"
          stroke="#e2e8f0"
          strokeWidth="12"
          fill="transparent"
          className="transition-all duration-1000"
        />
        <circle
          cx="96"
          cy="96"
          r="40"
          stroke={getColor()}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-0">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-sm font-medium text-slate-500">Grade: {grade}</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
