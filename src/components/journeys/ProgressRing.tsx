import React from 'react';

export function ProgressRing({ points, totalPoints, label }:{
  points: number;
  totalPoints: number;
  label?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center">
      <div className="text-lg font-semibold text-blue-600">
        {points}
      </div>
      {label && <div className="text-xs mt-1 opacity-70">{label}</div>}
    </div>
  );
}
