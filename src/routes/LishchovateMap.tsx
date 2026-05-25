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
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function LishchovateMap() {
    const { t, i18n } = useTranslation();
    useDocumentTitle(t('lishchovateMap.documentTitle'));
    
    const [opacity, setOpacity] = useState(0.75);
    const { data, owners } = useGeojsonData();
    const [selectedOwner, setSelectedOwner] = useState<OwnerInfo | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mapCenter: [number, number] = [49.49888, 22.56085];
    const mapZoom = 14;
    const mapBounds: LatLngBoundsExpression = [
        [49.45284, 22.39202], // South-West corner
        [49.56208, 22.70720]  // North-East corner
    ];

    const handleCollapsedChange = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(true);
        }
    };

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
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            <OwnersSidebar
                titleText={t('lishchovateMap.sidebar.title')}
                owners={owners}
                selectedOwner={selectedOwner}
                onSelectOwner={(owner) => setSelectedOwner(owner)}
                isCollapsed={isCollapsed}
                onCollapsedChange={setIsCollapsed}
            />

            <div className="relative flex-1 min-w-0 h-full bg-slate-100">
                {/* Expand/collapse sidebar button */}
                <div className="absolute inset-0 w-full h-full">
                    <button
                        onClick={handleCollapsedChange}
                        className="absolute z-1000 left-5 top-5 rounded-lg bg-white text-slate-700 p-2 shadow-lg border border-slate-100 transition-colors shadow-md cursor-pointer"
                    >
                        {isCollapsed ? (<PanelLeftOpen size={20} />) : (<PanelLeftClose size={20} />)}

                    </button>

                    <div className="absolute z-1000 left-20 top-5 rounded-lg bg-white shadow-lg border border-slate-100 p-1.5 transition-colors">
                        <LanguageSwitcher />
                    </div>
                    <OpacitySlider opacity={opacity} onChange={setOpacity} />

                    <MapContainer
                        key={isCollapsed ? 'map-collapsed' : 'map-expanded'}
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
                        <LayersControl position="topright" collapsed={false} key={i18n.language}>

                            <LayersControl.BaseLayer checked name={t('lishchovateMap.map.layerControl.osm')}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.BaseLayer checked name={t('lishchovateMap.map.layerControl.sattelite')}>
                                <TileLayer
                                    url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.Overlay checked name={t('lishchovateMap.map.layerControl.cadastral')}>
                                <TileLayer
                                    url="https://romankzk.github.io/map-tiles-leszczowate/tiles-1855/{z}/{x}/{y}.png"
                                    minZoom={12}
                                    maxZoom={22}
                                    maxNativeZoom={20} // Extrapolates pixels up to zoom 22 if tiles stop at 20
                                    opacity={opacity}
                                />
                            </LayersControl.Overlay>

                            {data && (
                                <LayersControl.Overlay checked name={t('lishchovateMap.map.layerControl.parcels')}>
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