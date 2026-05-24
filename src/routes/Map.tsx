import { LayersControl, MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useState } from "react";
import OpacitySlider from "../components/OpacitySlider";
import { ParcelStyles } from "../types/constants";
import type { OwnerInfo } from "../types";
import { useGeojsonData } from "../hooks/useGeojsonData";
import { getFeatureStyle } from "../utils/style-utils";
import type { LatLngBoundsExpression, Layer } from "leaflet";
import type { Feature } from 'geojson';
import OwnersSidebar from "../components/OwnersSidebar";

export default function Map() {
    const [opacity, setOpacity] = useState(0.75);
    const { data, owners } = useGeojsonData();
    const [selectedOwner, setSelectedOwner] = useState<OwnerInfo | null>(null);

    const mapCenter: [number, number] = [49.49888, 22.56085];
    const mapZoom = 14;
    const mapBounds: LatLngBoundsExpression = [
        [49.45284, 22.39202], // South-West corner
        [49.56208, 22.70720]  // North-East corner
    ];

    // Style each feature on init
    const onFeatureStyle = (feature: Feature | undefined) => {
        const currentFeatureHouse = feature?.properties?.house_number || feature?.properties?.houseNum;
        const currentFeatureOwner = feature?.properties?.owner?.trim();
        const featureHouseInt = currentFeatureHouse ? parseInt(currentFeatureHouse, 10) : null;
        const currentFeatureType = feature?.properties?.type;

        if (
            selectedOwner &&
            currentFeatureOwner === selectedOwner.owner &&
            featureHouseInt &&
            selectedOwner.houseNumbers.includes(featureHouseInt)
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
                    const matchingOwner = owners.find(o => o.owner === ownerName && o.houseNumbers.includes(houseNum));

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
                    currentOwner === selectedOwner.owner &&
                    currentHouseInt &&
                    selectedOwner.houseNumbers.includes(currentHouseInt)
                ) {
                    return;
                }
                e.target.setStyle(getFeatureStyle(feature.properties?.type));
            }
        });
    };

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <OwnersSidebar owners={owners} selectedOwner={selectedOwner} onSelectOwner={(owner) => setSelectedOwner(owner)} />

            <div className="relative flex-1 h-full bg-slate-100">
                <div className="relative w-full h-[100vh]">
                    <OpacitySlider opacity={opacity} onChange={setOpacity} />

                    <MapContainer
                        className="w-full h-full"
                        center={mapCenter}
                        zoom={mapZoom}
                        minZoom={12}
                        maxZoom={20}
                        maxBounds={mapBounds}
                        maxBoundsViscosity={1.0}
                        preferCanvas={true}
                        zoomControl={false}
                    >
                        <ZoomControl position="bottomright" />
                        <LayersControl position="topright" collapsed={false}>

                            <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.BaseLayer checked name="Супутникова карта">
                                <TileLayer
                                    url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.Overlay checked name="Карта 1855 р.">
                                <TileLayer
                                    url="https://romankzk.github.io/map-tiles-leszczowate/tiles-1855/{z}/{x}/{y}.png"
                                    minZoom={12}
                                    maxZoom={22}
                                    maxNativeZoom={20} // Extrapolates pixels up to zoom 22 if tiles stop at 20
                                    opacity={opacity}
                                />
                            </LayersControl.Overlay>

                            {data && (
                                <LayersControl.Overlay checked name="Інтерактивні ділянки">
                                    <GeoJSON
                                        data={data}
                                        onEachFeature={onEachParcel}
                                        style={(feature) => onFeatureStyle(feature)}
                                        key={selectedOwner ? `highlight-${selectedOwner.id}` : 'default'}
                                    />
                                </LayersControl.Overlay>
                            )}
                        </LayersControl>
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}