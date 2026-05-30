import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import OwnersSidebar from "@/components/Sidebar";
import { useOwnersData } from "@/hooks/useOwnersData";
import { useOwnerModal } from "@/hooks/useOwnerModal";
import OwnerDetailsModal from "@/components/OwnerDetailsModal";
import { MapConfig } from "@/types/constants";
import LeafletMap from "@/components/LeafletMap";
import { useSidebar } from "@/hooks/useSidebar";
import { useParcelsData } from "@/hooks/useParcelsData";
import { useState } from "react";
import type { HoveredParcel, Owner } from "@/types";
import { useParcelHandlers } from "@/hooks/useParcelHandlers";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('villages.perehnoiv.documentTitle'));

    const { data: parcels } = useParcelsData('perehnoiv/parcels.geojson');
    const { owners } = useOwnersData('perehnoiv/owners.json', false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [hoveredParcel, setHoveredParcel] = useState<HoveredParcel | null>(null);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();
    
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
                titleText={t('villages.perehnoiv.sidebarTitle')}
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
                mapConfig={MapConfig.Perehnoiv}
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
                    url: "https://romankzk.github.io/map-tiles-perehnoiv/tiles/{z}/{x}/{y}.png"
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