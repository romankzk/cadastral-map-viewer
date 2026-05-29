import { Globe } from 'lucide-react';
import { useState } from 'react';
import BaseLanguageControl from '../BaseLanguageControl';

export default function LanguageSwitcher() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute z-1000 left-5 md:left-20 top-16 md:top-5 flex items-center rounded-lg bg-white shadow-lg border border-slate-100 p-1.25 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden flex items-center justify-center text-slate-700 rounded p-1 transition-colors cursor-pointer"
        aria-label="Toggle language switcher"
      >
        <Globe size={20} />
      </button>

      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-w-[200px] opacity-100 ml-1' : 'max-w-0 opacity-0 md:max-w-[200px] md:opacity-100'
        }`}>
        <BaseLanguageControl onClick={() => setIsExpanded(false)} />
      </div>
    </div>
  );
}