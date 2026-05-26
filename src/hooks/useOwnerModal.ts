import { useState } from "react";
import type { Owner } from "../types";

export function useOwnerModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<Owner | null>(null);

    const handleModalOpen = (ownerRecord: Owner) => {
        setModalData(ownerRecord);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setModalData(null);
        setIsModalOpen(false);
    };

    return { isModalOpen, modalData, handleModalOpen, handleModalClose };
}