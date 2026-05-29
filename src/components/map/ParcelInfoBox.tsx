import { House, LandPlot } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ParcelInfoBoxProps {
    activeParcel: {
        parcel_number?: string | number;
        owner_uk?: string;
        owner_pl?: string;
        ownerName?: string;
        houseNumber?: string;
        house_number?: string;
        land_category?: string;
        type?: string;
        parcel_type?: string;
    } | null;
}

const ParcelTypes = {
    garden: "город",
    pasture: "сіножать / лука",
    common_pasture: "пасовище",
    building: "будівля",
    yard: "подвір'я",
    field: "поле",
    water: "ріка / став",
    orchard: "сад"
} as const;

export default function ParcelInfoBox({ activeParcel }: ParcelInfoBoxProps) {
    const { t, i18n } = useTranslation();

    if (!activeParcel) return null;

    const ownerName = activeParcel.ownerName || (i18n.language === 'uk' ? activeParcel.owner_uk : activeParcel.owner_pl);
    const parcelNum = activeParcel.parcel_number;
    const category = activeParcel.land_category;
    const houseNum = activeParcel.houseNumber || activeParcel.house_number;

    return (
        <div className="absolute bottom-5 left-5 z-[1000] min-w-[200px] max-w-[300px] rounded-lg bg-white shadow-xl border border-slate-200 p-4 transition-all duration-300 pointer-events-none">
            <div className="flex flex-col gap-2 w-full">
                {parcelNum ? (
                    <div className="flex flex-row items-center gap-3">
                        {activeParcel.parcel_type === "build"
                            ? (
                                <div className="p-1.5 rounded bg-orange-100/50 text-orange-600">
                                    <House className="text-orange-600" size={32} />
                                </div>
                            )
                            : (
                                <div className="p-1.5 rounded bg-green-100/50 text-green-600">
                                    <LandPlot size={32} />
                                </div>
                            )}
                        <div>
                            <div className="text-lg font-bold text-slate-800">
                                {t('mapControls.parcelInfo.parcelLabel')} {parcelNum || '—'}
                            </div>
                            {category && (
                                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                                    {
                                        (category in ParcelTypes)
                                            ? ParcelTypes[category as keyof typeof ParcelTypes]
                                            : category
                                    }
                                </div>
                            )}
                        </div>
                    </div>) : (
                    <div className="text-lg font-bold text-slate-800">
                         {t('mapControls.parcelInfo.parcelLabel')}
                    </div>
                )}

                {ownerName && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-2">
                        <div className="text-xs uppercase tracking-wider font-bold text-slate-400">
                             {t('mapControls.parcelInfo.ownerLabel')}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100/80 text-slate-700 uppercase">
                                {houseNum || '—'}
                            </div>
                            <div className="text-base font-semibold text-slate-700 leading-tight">
                                {ownerName}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}