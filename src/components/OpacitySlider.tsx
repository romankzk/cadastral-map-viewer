import { Layers } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function OpacitySlider({ opacity, onChange }: { opacity: number, onChange: (e: number) => void }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`absolute top-32 md:top-20 left-5 z-[1000] flex flex-col gap-2 rounded-lg bg-white shadow-lg border border-slate-100 p-1 transition-all duration-300 ${isExpanded ? 'w-[220px]' : 'w-fit md:w-[220px]'}`}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden flex items-center justify-center text-slate-700 rounded p-1 transition-colors cursor-pointer"
          aria-label="Toggle opacity slider"
        >
          <Layers size={20} />
        </button>

        <div className={`flex flex-col flex-1 gap-2 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[100px] opacity-100 p-2' : 'max-h-0 max-w-0 md:max-w-full opacity-0 md:max-h-[100px] md:opacity-100 md:p-2'}`}>
          <div className="flex justify-between items-center">
            <label
              htmlFor="opacity-range"
              className="text-sm font-semibold text-slate-700 select-none whitespace-nowrap"
            >
              {t('lishchovateMap.map.opacityLabel')}
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
    </div>
  );
}