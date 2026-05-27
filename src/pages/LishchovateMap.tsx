import 'leaflet/dist/leaflet.css';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState } from "react";
import { MapConfig, ParcelStyles } from "../types/constants";
import type { Owner } from "../types";
import { useParcelsData } from "../hooks/useParcelsData";
import { getFeatureStyle } from "../utils/style-utils";
import type { Layer } from "leaflet";
import type { Feature } from 'geojson';
import OwnersSidebar from "../components/OwnersSidebar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import { useOwnersData } from "../hooks/useOwnersData";
import OwnerDetailsModal from "../components/OwnerDetailsModal";
import { useOwnerModal } from "../hooks/useOwnerModal";
import LeafletMap from "../components/LeafletMap";
import { useSidebar } from "../hooks/useSidebar";

export default function LishchovateMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('lishchovateMap.documentTitle'));

    const { data: parcels } = useParcelsData('leszczowate-parcels.geojson');
    const { owners } = useOwnersData('leszczowate-parcels.geojson', true);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();

    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const { isCollapsed, handleCollapsedChange } = useSidebar();
    
    // Style each feature on init
    const onFeatureStyle = (feature: Feature | undefined) => {
        const currentFeatureHouse = feature?.properties?.house_number || feature?.properties?.houseNum;
        const currentFeatureOwner = feature?.properties?.owner?.trim();
        const featureHouseInt = currentFeatureHouse ? parseInt(currentFeatureHouse, 10) : null;
        const currentFeatureType = feature?.properties?.type;

        if (
            selectedOwner &&
            currentFeatureOwner === selectedOwner.ownerName &&
            featureHouseInt &&
            selectedOwner.houseNumber === featureHouseInt
        ) {
            return ParcelStyles.selected;
        }
        return getFeatureStyle(currentFeatureType);
    }

    // Event handlers for parcels
    const onEachParcel = (feature: Feature, layer: Layer) => {
        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
        const ownerName = feature.properties?.owner?.trim();

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
            },
            mouseout: (e) => {
                const currentOwner = feature.properties?.owner?.trim();
                const currentHouse = feature.properties?.house_number || feature.properties?.houseNum;
                const currentHouseInt = currentHouse ? parseInt(currentHouse, 10) : null;

                if (
                    selectedOwner &&
                    currentOwner === selectedOwner.ownerName &&
                    currentHouseInt &&
                    selectedOwner.houseNumber === currentHouseInt
                ) {
                    return;
                }
                e.target.setStyle(getFeatureStyle(feature.properties?.type));
            }
        });
    };

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
                geojsonLayer={{
                    name: t('lishchovateMap.map.layerControl.parcels'),
                    node: parcels ? (
                        <GeoJSON
                            data={parcels}
                            onEachFeature={onEachParcel}
                            style={(feature) => onFeatureStyle(feature)}
                            key={selectedOwner ? `highlight-${selectedOwner.id}` : 'default'}
                        />
                    ) : null
                }}
                tileLayer={{
                    name: t('lishchovateMap.map.layerControl.cadastral'),
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