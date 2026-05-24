import { Blocks } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function PerehnoivMap() {
    useDocumentTitle("Перегноїв - Історичні кадастрові карти");
    
    return (
        <div className="absolute inset-0 w-full h-full bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center relative overflow-hidden">

                {/* Decorative Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

                {/* Construction Icon */}
                <div className="mx-auto w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
                    <Blocks className="h-8 w-8 text-amber-600" />
                </div>

                {/* Content */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-3">
                    Карта в розробці
                </span>

                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Перегноїв
                </h2>

                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                    Наразі ми працюємо над опрацюванням архівних кадастрових карт, прив'язкою координат та верифікацією списків історичних власників земельних наділів.
                </p>

                {/* Informational Box */}
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-400 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Плануємо публікацію найближчим часом.
                </div>

                {/* Navigation Action Button */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                    <Link
                        to="/"
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Повернутися на головну
                    </Link>
                </div>

            </div>
        </div>
    )
}