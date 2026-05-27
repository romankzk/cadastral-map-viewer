import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";
import OwnersSidebar from "../components/OwnersSidebar";
import { useOwnersData } from "../hooks/useOwnersData";
import { useOwnerModal } from "../hooks/useOwnerModal";
import OwnerDetailsModal from "../components/OwnerDetailsModal";
import { MapConfig } from "../types/constants";
import LeafletMap from "../components/LeafletMap";
import { useSidebar } from "../hooks/useSidebar";

export default function PerehnoivMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('perehnoivMap.documentTitle'));

    const { owners } = useOwnersData('perehnoiv/owners.json', false);
    const { isModalOpen, modalData, handleModalOpen, handleModalClose } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            {/* Sidebar */}
            <OwnersSidebar
                titleText={t('perehnoivMap.sidebarTitle')}
                owners={owners}
                isSelectable={false}
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