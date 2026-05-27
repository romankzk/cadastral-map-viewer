import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { SquareArrowOutUpRight } from 'lucide-react';

interface VillageCard {
    slug: string;
    title: string;
    region: string;
    date: string;
    description: string;
    sources?: {
        text: string,
        link?: string
    }[]
}

export default function Home() {
    const { t } = useTranslation();
    useDocumentTitle(t('home.documentTitle'));

    const FeaturedMaps: VillageCard[] = [
        {
            slug: 'lishchovate',
            title: t('home.cards.lishchovate.title'),
            region: t('home.cards.lishchovate.region'),
            date: t('home.cards.lishchovate.date'),
            description: t('home.cards.lishchovate.description'),
            sources: [
                { text: "APP - Archiwum Geodezyjne. - Leszczowate. - sygn. 3", link: "https://www.szukajwarchiwach.gov.pl/en/jednostka/-/jednostka/27137468" },
                { text: "APP - Archiwum Geodezyjne. - sygn. 0896M" }
            ]
        },
        {
            slug: 'doshno',
            title: t('home.cards.doshno.title'),
            region: t('home.cards.doshno.region'),
            date: t('home.cards.doshno.date'),
            description: t('home.cards.doshno.description'),
            sources: [
                { text: "APP - Archiwum Geodezyjne. - Deszno. - sygn. 1-10", link: "https://www.szukajwarchiwach.gov.pl/en/seria?p_p_id=Seria&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&_Seria_nameofjsp=jednostki&_Seria_id_serii=718365" }
            ]
        },
        {
            slug: 'perehnoiv',
            title: t('home.cards.perehnoiv.title'),
            region: t('home.cards.perehnoiv.region'),
            date: t('home.cards.perehnoiv.date'),
            description: t('home.cards.perehnoiv.description'),
            sources:  [
                { text: t('home.cards.perehnoiv.source1') },
                { text: t('home.cards.perehnoiv.source2') }
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Platform Header */}
            <header className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                    {t('home.title')}
                </h1>
                <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
                    {t('home.subtitle')}
                </p>
                <div className="mt-4 h-0.5 w-16 bg-blue-500 mx-auto rounded" />
            </header>

            {/* Grid Selection */}
            <div className="grid gap-6 md:grid-cols-3">
                {FeaturedMaps.map((village) => (
                    <div
                        key={village.slug}
                        className="flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                        <div>

                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {village.title}
                            </h2>

                            <p className="text-xs font-medium text-slate-400 mt-0.5 mb-3">
                                {village.region}
                            </p>

                            <div className="flex items-center justify-between my-3">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200`}>
                                    {village.date}
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                {village.description}
                            </p>

                            {village.sources && (
                                <div className="text-sm text-slate-600 leading-relaxed mt-2">
                                    <span>{t('home.cards.sourcesText')}:</span>
                                    <ul className="text-xs list-disc ml-4">
                                        {village.sources.map(source => {
                                            if (!source.link) {
                                                return (
                                                    <li>{source.text}</li>
                                                )
                                            }
                                            else return (
                                                <li><a href={source.link} className="text-blue-500 flex items-center gap-1">
                                                    {source.text}
                                                    <SquareArrowOutUpRight size={10} />
                                                </a></li>)
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 pt-4 border-t border-slate-100">
                            <Link
                                to={`/maps/${village.slug}`}
                                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                            >
                                {t('home.cards.openBtn')}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info Note */}
            <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
                {t('home.footer')}
            </footer>

            <div className="flex flex-col items-center mt-8">
                <LanguageSwitcher />
            </div>
        </div>
    );
}