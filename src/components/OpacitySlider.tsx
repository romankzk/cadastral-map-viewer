import React from 'react';

export default function OpacitySlider({ opacity, onChange }: { opacity: number, onChange: (e: number) => void }) {
  return (
    <div className="absolute bottom-10 left-5 z-[1000] min-w-[220px] rounded-lg bg-white p-4 shadow-lg border border-slate-100 pointer-events-auto">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label 
            htmlFor="opacity-range" 
            className="text-sm font-semibold text-slate-700 select-none"
          >
            Прозорість
          </label>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        
        <input
          id="opacity-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
        />
      </div>
    </div>
  );
}