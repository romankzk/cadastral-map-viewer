import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import OwnersSidebar from "../components/Sidebar";
import { useOwnersData } from "../hooks/useOwnersData";
import { useOwnerModal } from "../hooks/useOwnerModal";
import OwnerDetailsModal from "../components/OwnerDetailsModal";
import { MapConfig } from "../types/constants";
import LeafletMap from "../components/LeafletMap";
import { useSidebar } from "../hooks/useSidebar";
import { useParcelsData } from "../hooks/useParcelsData";
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState, useMemo } from "react";
import type { Owner, ParcelBasic, ParcelDetailed } from "../types";
import { useParcelHandlers } from "../hooks/useParcelHandlers";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('perehnoivMap.documentTitle'));

    const { data: parcels } = useParcelsData('perehnoiv/parcels.geojson');
    const { owners } = useOwnersData('perehnoiv/owners.json', false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [hoveredParcel, setHoveredParcel] = useState<ParcelBasic | ParcelDetailed | null>(null);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();
    
    const { onFeatureStyle, onEachParcel } = useParcelHandlers({
        mode: "basic",
        owners: owners,
        selectedOwner: selectedOwner,
        setSelectedOwner: setSelectedOwner,
        setHoveredParcel: setHoveredParcel
    });

    const geojsonNode = useMemo(() => {
        if (!parcels) return null;
        return (
            <GeoJSON
                data={parcels}
                onEachFeature={onEachParcel}
                style={onFeatureStyle}
                key={selectedOwner ? `highlight-${selectedOwner.id}` : 'default'}
            />
        );
    }, [parcels, onEachParcel, onFeatureStyle, selectedOwner]);

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            {/* Sidebar */}
            <OwnersSidebar
                titleText={t('perehnoivMap.sidebarTitle')}
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
                    node: geojsonNode
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