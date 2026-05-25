import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchFilterProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function SearchFilter({ value, onChange }: SearchFilterProps) {
  const { t } = useTranslation();
  
  return (
    <div className="relative w-full pb-3 border-b border-slate-200">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <span className="absolute left-3 text-slate-400 pointer-events-none">
          <Search size={16}/>
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('lishchovateMap.sidebar.searchPlaceholder')}
          className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-md border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-150"
        />

        {/* Clear Button (Only shows up when user typed text) */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
            title="Очистити пошук"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}