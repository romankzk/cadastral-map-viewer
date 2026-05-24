import { Link } from 'react-router-dom';

interface VillageCard {
    slug: string;
    title: string;
    region: string;
    date: string;
    description: string;
}

const FeaturedMaps: VillageCard[] = [
    {
        slug: 'perehnoiv',
        title: 'Перегноїв',
        region: 'Глинянська громада, Львівська область',
        date: '1845 рік',
        description: 'Історично село у складі Глинянського староства, пізніше Золочівського округу. Фінальна карта з фонду 186 ЦДІАЛ.'
    },
    {
        slug: 'lishchovate',
        title: 'Ліщовате',
        region: 'Бещадський повіт, Підкарпатське воєводство',
        date: '1852-1855 роки',
        description: 'Раніше у власності родини Країнських, у складі Сяноцького округу. Карта на основі ескізу 1852 року та фінальної карти (недатована, бл. 1855 р.) з Державного архіву у Перемишлі.'
    }
];

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Platform Header */}
            <header className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                    Історичні кадастрові карти
                </h1>
                <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
                    Інтерактивний переглядач історичних карт та планів громад Галичини.
                </p>
                <div className="mt-4 h-0.5 w-16 bg-blue-500 mx-auto rounded" />
            </header>

            {/* Grid Selection */}
            <div className="grid gap-6 md:grid-cols-2">
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
                        </div>

                        <div className="mt-3 pt-4 border-t border-slate-100">
                            <Link
                                to={`/maps/${village.slug}`}
                                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                            >
                                Відкрити карту
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Info Note */}
            <footer className="mt-16 text-center text-xs text-slate-400 font-medium">
                Карти та дані опрацьовано на основі оригінальних кадастрових карт з ЦДІАЛ та AP Przemyśl.
            </footer>
        </div>
    );
}