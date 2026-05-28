import { LayersControl, MapContainer, TileLayer, useMapEvents, ZoomControl } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { PanelBottomClose, PanelBottomOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import OpacitySlider from "./OpacitySlider";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { MapConfig } from "../types/constants";

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
        node: React.ReactNode
    }
}

export default function LeafletMap({
    mapConfig,
    sidebarState,
    geojsonLayer,
    tileLayer
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
        <div className={`relative flex-1 min-w-0 ${sidebarState.isCollapsed ? `h-full` : `h-[50vh]`} md:h-full bg-slate-100`}>

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
                <div className="absolute z-1000 left-20 top-5 rounded-lg bg-white shadow-lg border border-slate-100 p-1.5 transition-colors">
                    <LanguageSwitcher />
                </div>

                {/* Opacity Control */}
                {tileLayer && isTileVisible && (
                    <OpacitySlider opacity={opacity} onChange={setOpacity} />
                )}

                {/* Leaflet Map */}
                <MapContainer
                    key={sidebarState.isCollapsed ? 'map-expanded' : 'map-collapsed'}
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
                    <LayerStateTracker onVisibilityChange={handleLayerToggle} />

                    <ZoomControl position="bottomright" />
                    <LayersControl position="topright" collapsed={false} key={i18n.language}>

                        <LayersControl.BaseLayer checked name={t('lishchovateMap.map.layerControl.osm')}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LayersControl.BaseLayer>

                        <LayersControl.BaseLayer checked name={t('lishchovateMap.map.layerControl.satellite')}>
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
                                    maxNativeZoom={22} // Extrapolates pixels up to zoom 22 if tiles stop at 20
                                    opacity={opacity}
                                />
                            </LayersControl.Overlay>
                        )}

                        {geojsonLayer && geojsonLayer.node && (
                            <LayersControl.Overlay checked name={geojsonLayer.name}>
                                {geojsonLayer.node}
                            </LayersControl.Overlay>
                        )}
                    </LayersControl>


                </MapContainer>
            </div>
        </div>
    )
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