import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const languages = [
    { code: 'uk', label: 'UA' },
    { code: 'pl', label: 'PL' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="absolute z-1000 left-5 md:left-20 top-18 md:top-5 flex items-center rounded-lg bg-white shadow-lg border border-slate-100 p-1.25 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden flex items-center justify-center text-slate-700 rounded p-1 transition-colors cursor-pointer"
        aria-label="Toggle language switcher"
      >
        <Globe size={20} />
      </button>

      <div className={`flex gap-1.5 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-w-[200px] opacity-100 ml-1' : 'max-w-0 opacity-0 md:max-w-[200px] md:opacity-100'
        }`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              setIsExpanded(false);
            }}
            className={`cursor-pointer px-1.5 py-1 text-xs font-bold rounded border transition-colors whitespace-nowrap ${i18n.language === lang.code
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}