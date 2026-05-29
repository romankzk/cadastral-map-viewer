import 'leaflet/dist/leaflet.css';
import { useState } from "react";
import { MapConfig } from "@/types/constants";
import type { Owner, ParcelBasic, ParcelDetailed } from "@/types";
import { useParcelsData } from "@/hooks/useParcelsData";
import OwnersSidebar from "@/components/Sidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import { useOwnersData } from "@/hooks/useOwnersData";
import OwnerDetailsModal from "@/components/OwnerDetailsModal";
import { useOwnerModal } from "@/hooks/useOwnerModal";
import LeafletMap from "@/components/LeafletMap";
import { useSidebar } from "@/hooks/useSidebar";
import { useParcelHandlers } from "@/hooks/useParcelHandlers";

export default function LeszczowateMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('villages.leszczowate.documentTitle'));

    const { data: parcels } = useParcelsData('leszczowate/parcels.geojson');
    const { owners } = useOwnersData('leszczowate/parcels.geojson', true);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();

    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [hoveredParcel, setHoveredParcel] = useState<ParcelBasic | ParcelDetailed | null>(null);
    const { isCollapsed, handleCollapsedChange } = useSidebar();

    const { onFeatureStyle, onEachParcel } = useParcelHandlers({
        mode: "detailed",
        owners: owners,
        selectedOwner: selectedOwner,
        setSelectedOwner: setSelectedOwner,
        setHoveredParcel: setHoveredParcel
    });

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            <OwnersSidebar
                titleText={t('villages.leszczowate.sidebarTitle')}
                owners={owners}
                isSelectable={true}
                selectedOwner={selectedOwner}
                onSelectOwner={(owner) => setSelectedOwner(owner)}
                isCollapsed={isCollapsed}
                onCollapsedChange={handleCollapsedChange}
                onDetailsClick={handleModalOpen}
            />

            {/* Map Container */}
            <LeafletMap
                mapConfig={MapConfig.Leszczowate}
                sidebarState={{
                    isCollapsed: isCollapsed,
                    onCollapseChange: handleCollapsedChange
                }}
                activeParcel={hoveredParcel}
                geojsonLayer={{
                    name: t('mapControls.layerControl.parcels'),
                    data: parcels,
                    selectedOwner: selectedOwner,
                    onEachParcel: onEachParcel,
                    onFeatureStyle: onFeatureStyle

                }}
                tileLayer={{
                    name: t('mapControls.layerControl.historical'),
                    url: "https://romankzk.github.io/map-tiles-leszczowate/tiles-1855/{z}/{x}/{y}.png"
                }}
            />

            {/* Owner Details Modal */}
            <OwnerDetailsModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                ownerData={modalData}
            />
        </div>
    )
}