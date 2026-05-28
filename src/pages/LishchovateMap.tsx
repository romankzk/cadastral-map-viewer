import 'leaflet/dist/leaflet.css';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState, useCallback, useMemo } from "react";
import { MapConfig, ParcelStyles } from "../types/constants";
import type { Owner } from "../types";
import { useParcelsData } from "../hooks/useParcelsData";
import { getFeatureStyle } from "../utils/style-utils";
import type { Layer } from "leaflet";
import type { Feature } from 'geojson';
import OwnersSidebar from "../components/Sidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import { useOwnersData } from "../hooks/useOwnersData";
import OwnerDetailsModal from "../components/OwnerDetailsModal";
import { useOwnerModal } from "../hooks/useOwnerModal";
import LeafletMap from "../components/LeafletMap";
import { useSidebar } from "../hooks/useSidebar";

export default function LishchovateMap() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(t('lishchovateMap.documentTitle'));

    const { data: parcels } = useParcelsData('leszczowate/parcels.geojson');
    const { owners } = useOwnersData('leszczowate/parcels.geojson', true);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();

    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const [hoveredParcel, setHoveredParcel] = useState<any>(null);
    const { isCollapsed, handleCollapsedChange } = useSidebar();
    
    // Helper to check if a feature's parcel belongs to the currently selected owner
    const isFeatureSelected = useCallback((feature: Feature | undefined) => {
        const currentFeatureOwner = i18n.language === 'uk' ? feature?.properties?.owner_uk?.trim() : feature?.properties?.owner_pl?.trim();
        const currentFeatureHouse = feature?.properties?.house_number;
        const featureHouseInt = currentFeatureHouse ? parseInt(currentFeatureHouse, 10) : null;

        return (
            selectedOwner &&
            currentFeatureOwner === selectedOwner.ownerName &&
            featureHouseInt &&
            selectedOwner.houseNumber === featureHouseInt
        );
    }, [selectedOwner, i18n.language]);

    // Style each feature on init
    const onFeatureStyle = useCallback((feature: Feature | undefined) => {
        const currentFeatureType = feature?.properties?.type;

        if (isFeatureSelected(feature)) {
            return ParcelStyles.selected;
        }
        return getFeatureStyle(currentFeatureType);
    }, [isFeatureSelected]);

    // Event handlers for parcels
    const onEachParcel = useCallback((feature: Feature, layer: Layer) => {
        const rawHouseNum = feature.properties?.house_number;
        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
        const ownerName = i18n.language === 'uk' ? feature?.properties?.owner_uk?.trim() : feature?.properties?.owner_pl?.trim();

        layer.on({
            click: () => {
                if (ownerName && houseNum) {
                    const matchingOwner = owners.find(o => o.ownerName === ownerName && o.houseNumber === houseNum);

                    if (matchingOwner) {
                        setSelectedOwner(matchingOwner);

                        const targetButton = document.getElementById(`owner-btn-${matchingOwner.id}`);
                        if (targetButton) {
                            targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            },
            mouseover: (e) => {
                e.target.setStyle(ParcelStyles.hover);
                setHoveredParcel(feature.properties);
            },
            mouseout: (e) => {
                setHoveredParcel(null);
                if (isFeatureSelected(feature)) {
                    e.target.setStyle(ParcelStyles.selected);
                    return;
                }
                e.target.setStyle(getFeatureStyle(feature.properties?.type));
            }
        });
    }, [owners, isFeatureSelected, i18n.language]);

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
            <OwnersSidebar
                titleText={t('lishchovateMap.sidebarTitle')}
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
                    node: geojsonNode
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