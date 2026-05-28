import { useTranslation } from 'react-i18next';

export default function BaseLanguageControl({ onClick }: { onClick?: () => void }) {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'uk', label: 'UA' },
        { code: 'pl', label: 'PL' },
        { code: 'en', label: 'EN' },
    ];

    return (
        <div className="flex gap-1.5 transition-all duration-300 overflow-hidden">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => {
                        i18n.changeLanguage(lang.code);
                        if (onClick) onClick();
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
    );
}