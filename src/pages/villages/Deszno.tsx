import LeafletMap from "@/components/LeafletMap";
import OwnersSidebar from "@/components/Sidebar";
import { useOwnerModal } from "@/hooks/useOwnerModal";
import { useOwnersData } from "@/hooks/useOwnersData";
import { MapConfig } from "@/types/constants";
import OwnerDetailsModal from "@/components/OwnerDetailsModal";
import { useSidebar } from "@/hooks/useSidebar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useTranslation } from "react-i18next";

export default function DesznoMap() {
    const { t } = useTranslation();
    useDocumentTitle(t('villages.deszno.documentTitle'));

    const { owners } = useOwnersData('deszno/owners.json', false);
    const { isModalOpen, modalData, handleModalClose, handleModalOpen } = useOwnerModal();
    const { isCollapsed, handleCollapsedChange } = useSidebar();

    return (
        <div className="flex flex-1 w-full h-screen overflow-hidden">
            {/* Sidebar */}
            <OwnersSidebar
                titleText={t('villages.deszno.sidebarTitle')}
                owners={owners}
                isSelectable={false}
                isCollapsed={isCollapsed}
                onCollapsedChange={handleCollapsedChange}
                onDetailsClick={handleModalOpen}
            />

            {/* Map Container */}
            <LeafletMap
                mapConfig={MapConfig.Deszno}
                sidebarState={{
                    isCollapsed: isCollapsed,
                    onCollapseChange: handleCollapsedChange
                }}
                tileLayer={{
                    name: t('mapControls.layerControl.historical'),
                    url: "https://romankzk.github.io/map-tiles-deszno/tiles/{z}/{x}/{y}.png"
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