import LeafletMap from "@/components/LeafletMap";
import OwnersSidebar from "@/components/Sidebar";
import { useOwnerModal } from "@/hooks/useOwnerModal";
import { useOwnersData } from "@/hooks/useOwnersData";
import { MapConfig } from "@/types/constants";
import OwnerDetailsModal from "@/components/OwnerDetailsModal";
import { useSidebar } from "@/hooks/useSidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type { HoveredParcel, Owner } from "@/types";
import { useParcelHandlers } from "@/hooks/useParcelHandlers";
import { useParcelsData } from "@/hooks/useParcelsData";

export default function DesznoMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('villages.deszno.documentTitle'));

    const { owners } = useOwnersData('deszno/owners.json', false);
    const { data: parcels } = useParcelsData('deszno/parcels.geojson');
    const { isModalOpen, modalData, handleModalClose, handleModalOpen } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [hoveredParcel, setHoveredParcel] = useState<HoveredParcel | null>(null);

    const { onFeatureStyle, onEachParcel } = useParcelHandlers({
        mode: "basic",
        owners: owners,
        selectedOwner: selectedOwner,
        setSelectedOwner: setSelectedOwner,
        setHoveredParcel: setHoveredParcel
    });

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            {/* Sidebar */}
            <OwnersSidebar
                titleText={t('villages.deszno.sidebarTitle')}
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
                mapConfig={MapConfig.Deszno}
                sidebarState={{
                    isCollapsed: isCollapsed,
                    onCollapseChange: handleCollapsedChange
                }}
                activeParcel={hoveredParcel}
                tileLayer={{
                    name: t('mapControls.layerControl.historical'),
                    url: "https://romankzk.github.io/map-tiles-deszno/tiles/{z}/{x}/{y}.png"
                }}
                geojsonLayer={{
                    name: t('mapControls.layerControl.parcels'),
                    data: parcels,
                    selectedOwner: selectedOwner,
                    onEachParcel: onEachParcel,
                    onFeatureStyle: onFeatureStyle
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