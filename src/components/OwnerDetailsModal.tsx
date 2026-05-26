import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Owner } from '../types';
import { X } from 'lucide-react';

interface OwnerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownerData: Owner | null;
}

export default function OwnerDetailsModal({ isOpen, onClose, ownerData }: OwnerDetailsModalProps) {
    const { t } = useTranslation();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            // Prevent background scrolling while modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !ownerData) return null;

    return (
        <div className="absolute inset-0 w-full h-full z-[1000] flex items-center justify-center p-4">

            {/* Backdrop Blur Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Box Container */}
            <div className="bg-white w-full max-w-md rounded-xl border border-slate-200 shadow-xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-150">

                {/* Header Panel */}
                <div className="px-6 pt-2 pb-4 bg-slate-50 border-b border-slate-200 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            {t("ownerModal.title")}
                        </h3>

                        {/* Close Action Button */}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 pt-3">
                        {ownerData.ownerName}
                    </h2>
                    {ownerData.ownerStatus && (
                    <p className="text-sm font-medium text-slate-500">
                       {ownerData.ownerStatus} 
                    </p>
                    )}
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-row gap-2">
                        {/* House Number */}
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                {t("ownerModal.houseNumber")}
                            </label>
                            <p className="text-base font-medium text-slate-800">
                                {ownerData.houseNumber || '—'}
                            </p>
                        </div>
                        {/* Owner Origin */}
                        {ownerData.ownerOrigin && (
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                {t("ownerModal.locality")}
                            </label>
                            <p className="text-base font-medium text-slate-900">
                                {ownerData.ownerOrigin}
                            </p>
                        </div>
                        )}
                    </div>

                    {/* Original Record */}
                    {ownerData.ownerOriginal && (
                        <>
                            <hr className="border-slate-100" />
                            <div>
                                <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                    {t("ownerModal.original")}
                                </label>
                                <p className="text-base font-medium text-slate-800">
                                    {ownerData.ownerOriginal}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Note */}
                    {ownerData.note && (
                        <>
                            <hr className="border-slate-100" />
                            <div>
                                <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                    {t("ownerModal.note")}
                                </label>
                                <p className="text-base font-medium text-slate-800">
                                    {ownerData.note}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Parcels Numbers */}
                    {(ownerData.buildParcels || ownerData.landParcels) && (
                        <>
                            <hr className="border-slate-100" />
                            <div className="flex flex-row">
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                        {t("ownerModal.buildParcels")}
                                    </label>
                                    <p className="text-base font-medium text-slate-800">
                                        {ownerData.buildParcels ? ownerData.buildParcels.length : "-"}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-slate-400 block mb-0.5">
                                        {t("ownerModal.landParcels")}
                                    </label>
                                    <p className="text-base font-medium text-slate-800">
                                        {ownerData.landParcels ? ownerData.landParcels.length : "-"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}