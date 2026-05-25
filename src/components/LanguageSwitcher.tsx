import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage('uk')}
        className={`cursor-pointer px-2 py-1 text-xs font-bold rounded border transition-colors ${
          i18n.language === 'uk' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        UA
      </button>
      <button
        onClick={() => i18n.changeLanguage('pl')}
        className={`cursor-pointer px-2 py-1 text-xs font-bold rounded border transition-colors ${
          i18n.language === 'pl' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        PL
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`cursor-pointer px-2 py-1 text-xs font-bold rounded border transition-colors ${
          i18n.language === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        EN
      </button>
    </div>
  );
}