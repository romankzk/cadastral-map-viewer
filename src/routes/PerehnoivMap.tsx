import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { type LatLngBoundsExpression } from "leaflet";
import OwnersSidebar from "../components/OwnersSidebar";
import OpacitySlider from "../components/OpacitySlider";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { LayersControl, MapContainer, ZoomControl, TileLayer } from "react-leaflet";
import i18n from "../i18n";
import { useOwnersData } from "../hooks/useOwnersData";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useOwnerModal } from "../hooks/useOwnerModal";
import OwnerDetailsModal from "../components/OwnerDetailsModal";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('perehnoivMap.documentTitle'));

    const { owners } = useOwnersData('perehnoiv-owners.json', false);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();

    const [opacity, setOpacity] = useState(0.75);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const mapCenter: [number, number] = [49.80731, 24.57350];
    const mapZoom = 14;
    const mapBounds: LatLngBoundsExpression = [
        [49.74678, 24.46878], // South-West corner
        [49.85103, 24.67981]  // North-East corner
    ];

    const handleCollapsedChange = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(true);
        }
    };

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            <OwnersSidebar
                titleText={t('perehnoivMap.sidebarTitle')}
                owners={owners}
                isSelectable={false}
                isCollapsed={isCollapsed}
                onCollapsedChange={setIsCollapsed}
                onDetailsClick={handleModalOpen}
            />

            <div className="relative flex-1 min-w-0 h-full bg-slate-100">
                <div className="absolute inset-0 w-full h-full">
                    {/* Expand/collapse sidebar button */}
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

                            <LayersControl.BaseLayer checked name={t('lishchovateMap.map.layerControl.satellite')}>
                                <TileLayer
                                    url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            </LayersControl.BaseLayer>
                        </LayersControl>

                        <OwnerDetailsModal
                            isOpen={isModalOpen}
                            onClose={handleModalClose}
                            ownerData={modalData}
                        />

                    </MapContainer>
                </div>
            </div>
        </div>
    )
}