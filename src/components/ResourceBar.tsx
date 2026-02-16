'use client';
import { useEffect, useRef } from 'react';

interface Props {
  label: string;
  emoji: string;
  value: number;
  max: number;
  color: string;
  isCash?: boolean;
  flash?: 'good' | 'bad' | null;
}

export default function ResourceBar({ label, emoji, value, max, color, isCash, flash }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = isCash ? Math.min(100, (value / 300) * 100) : (value / max) * 100;

  useEffect(() => {
    if (flash && barRef.current) {
      barRef.current.classList.remove('animate-flash-good', 'animate-flash-bad');
      void barRef.current.offsetWidth;
      barRef.current.classList.add(flash === 'good' ? 'animate-flash-good' : 'animate-flash-bad');
    }
  }, [flash, value]);

  return (
    <div ref={barRef} className="flex items-center gap-2 w-full">
      <span className="text-lg w-6 text-center">{emoji}</span>
      <div className="flex-1 relative">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5 flex justify-between">
          <span>{label}</span>
          <span className="font-mono">{isCash ? `$${value}` : value}</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
            style={{ width: `${Math.max(0, pct)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
