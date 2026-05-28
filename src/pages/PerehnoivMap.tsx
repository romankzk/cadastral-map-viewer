import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import OwnersSidebar from "../components/Sidebar";
import { useOwnersData } from "../hooks/useOwnersData";
import { useOwnerModal } from "../hooks/useOwnerModal";
import OwnerDetailsModal from "../components/OwnerDetailsModal";
import { MapConfig, ParcelStyles } from "../types/constants";
import LeafletMap from "../components/LeafletMap";
import { useSidebar } from "../hooks/useSidebar";
import { useParcelsData } from "../hooks/useParcelsData";
import { GeoJSON } from 'react-leaflet/GeoJSON'
import type { Feature } from "geojson";
import { useState } from "react";
import type { Owner } from "../types";
import { getFeatureStyle } from "../utils/style-utils";
import type { Layer } from "leaflet";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('perehnoivMap.documentTitle'));

    const { data: parcels } = useParcelsData('perehnoiv/parcels.geojson');
    const { owners } = useOwnersData('perehnoiv/owners.json', false);
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();

    // Helper to check if a feature's parcel belongs to the currently selected owner
    const isFeatureSelected = (feature: Feature | undefined) => {
        if (!selectedOwner || !feature?.properties) return false;

        const parcelNum = parseInt(feature.properties.parcel_number, 10);
        const parcelType = feature.properties.parcel_type;

        if (isNaN(parcelNum)) return false;

        // Check the correct array based on the parcel type
        if (parcelType === 'build') {
            return selectedOwner.buildParcels?.includes(parcelNum) ?? false;
        } else {
            return selectedOwner.landParcels?.includes(parcelNum) ?? false;
        }
    };

    // Style each feature on init
    const onFeatureStyle = (feature: Feature | undefined) => {
        const currentFeatureType = feature?.properties?.land_category;

        if (isFeatureSelected(feature)) {
            return ParcelStyles.selected;
        }
        return getFeatureStyle(currentFeatureType);
    }

    // Event handlers for parcels
    const onEachParcel = (feature: Feature, layer: Layer) => {
        const rawParcelNum = feature.properties?.parcel_number;
        const parcelNum = rawParcelNum ? parseInt(rawParcelNum, 10) : null;
        const parcelType = feature.properties?.parcel_type; // "build" or "land"

        layer.on({
            click: () => {
                if (parcelNum && parcelType) {
                    // Find the owner who owns this specific parcel number within the correct array
                    const matchingOwner = owners.find(o => {
                        if (parcelType === 'build') {
                            return o.buildParcels?.includes(parcelNum);
                        } else {
                            return o.landParcels?.includes(parcelNum);
                        }
                    });

                    if (matchingOwner) {
                        setSelectedOwner(matchingOwner);

                        // Optional: Scroll sidebar item into view using orderNumber or id
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
                if (isFeatureSelected(feature)) {
                    return;
                }
                e.target.setStyle(getFeatureStyle(feature.properties?.land_category));
            }
        });
    };

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
                    name: t('perehnoivMap.map.layerControl.cadastral'),
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