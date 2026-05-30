import { LayersControl, MapContainer, TileLayer, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { PanelBottomClose, PanelBottomOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import LanguageSwitcher from "./map/LanguageSwitcher";
import OpacitySlider from "./map/OpacitySlider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MapConfig } from "../types/constants";
import ParcelInfoBox from "./map/ParcelInfoBox";
import { GeoJSON } from 'react-leaflet/GeoJSON'
import type { Feature, FeatureCollection } from "geojson";
import type { HoveredParcel, Owner } from "../types";
import type { Layer, PathOptions } from "leaflet";

interface LeafletMapProps {
    mapConfig: MapConfig
    sidebarState: {
        isCollapsed: boolean
        onCollapseChange: () => void
    },
    tileLayer?: {
        name: string,
        url: string
    },
    geojsonLayer?: {
        name: string,
        data: FeatureCollection | null,
        onEachParcel: (feature: Feature, layer: Layer) => void,
        onFeatureStyle: (feature: Feature | undefined) => PathOptions,
        selectedOwner: Owner | null
    },
    activeParcel?: HoveredParcel | null
}

export default function LeafletMap({
    mapConfig,
    sidebarState,
    geojsonLayer,
    tileLayer,
    activeParcel
}: LeafletMapProps) {
    const { t, i18n } = useTranslation();
    const [opacity, setOpacity] = useState(0.75);
    const [isTileVisible, setIsTileVisible] = useState(true);

    const handleLayerToggle = (layerName: string, isVisible: boolean) => {
        if (layerName === tileLayer?.name) {
            setIsTileVisible(isVisible);
        }
    };

    return (
        <div className={`relative flex-1 min-w-0 ${sidebarState.isCollapsed ? `h-full` : `h-[50svh]`} md:h-full bg-slate-100 transition-all duration-300`}>

            <div className="absolute inset-0 w-full h-full">
                {/* Expand/collapse sidebar button */}
                <button
                    onClick={sidebarState.onCollapseChange}
                    className="absolute z-1000 left-5 top-5 rounded-lg bg-white text-slate-700 p-2 shadow-lg border border-slate-100 transition-colors shadow-md cursor-pointer"
                >
                    {sidebarState.isCollapsed
                        ? (<PanelLeftOpen size={20} className="hidden md:block" />)
                        : (<PanelLeftClose size={20} className="hidden md:block" />)}
                    {sidebarState.isCollapsed
                        ? (<PanelBottomOpen size={20} className="block md:hidden" />)
                        : (<PanelBottomClose size={20} className="block md:hidden" />)}

                </button>

                {/* Language Switch button */}
                <LanguageSwitcher />

                {/* Opacity Control */}
                {tileLayer && isTileVisible && (
                    <OpacitySlider opacity={opacity} onChange={setOpacity} />
                )}

                {/* Parcel Info Box */}
                <ParcelInfoBox activeParcel={activeParcel} />

                {/* Leaflet Map */}
                <MapContainer
                    className="w-full h-full"
                    center={mapConfig.center}
                    zoom={mapConfig.zoom}
                    minZoom={12}
                    maxZoom={20}
                    maxBounds={mapConfig.bounds}
                    maxBoundsViscosity={1.0}
                    preferCanvas={true}
                    zoomControl={false}
                >
                    <MapResizer isCollapsed={sidebarState.isCollapsed} />
                    <LayerStateTracker onVisibilityChange={handleLayerToggle} />

                    <ZoomControl position="bottomright" />
                    <LayersControl position="topright" collapsed={true} key={i18n.language}>

                        <LayersControl.BaseLayer checked name={t('mapControls.layerControl.osm')}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer checked name={t('mapControls.layerControl.satellite')}>
                            <TileLayer
                                url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>

                        {tileLayer && (
                            <LayersControl.Overlay checked name={tileLayer.name}>
                                <TileLayer
                                    url={tileLayer.url}
                                    minZoom={12}
                                    maxZoom={20}
                                    maxNativeZoom={20} // Extrapolates pixels up to zoom 22 if tiles stop at 20
                                    opacity={opacity}
                                />
                            </LayersControl.Overlay>
                        )}

                        {geojsonLayer && geojsonLayer.data && (
                            <LayersControl.Overlay checked name={geojsonLayer.name}>
                                <GeoJSON
                                    data={geojsonLayer.data}
                                    onEachFeature={geojsonLayer.onEachParcel}
                                    style={geojsonLayer.onFeatureStyle}
                                    key={`${i18n.language}-${geojsonLayer.selectedOwner 
                                        ? `highlight-${geojsonLayer.selectedOwner.id || `${geojsonLayer.selectedOwner.ownerName}-${geojsonLayer.selectedOwner.houseNumber}`}` 
                                        : 'default'}`}
                                />
                            </LayersControl.Overlay>
                        )}
                    </LayersControl>
                </MapContainer>
            </div>
        </div>
    )
}

function MapResizer({ isCollapsed }: { isCollapsed: boolean }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 310);
        return () => clearTimeout(timer);
    }, [isCollapsed, map]);

    return null;
}

function LayerStateTracker({ onVisibilityChange }: { onVisibilityChange: (name: string, isVisible: boolean) => void }) {
    useMapEvents({
        overlayadd: (e) => {
            onVisibilityChange(e.name, true);
        },
        overlayremove: (e) => {
            onVisibilityChange(e.name, false);
        }
    });

    return null;
}