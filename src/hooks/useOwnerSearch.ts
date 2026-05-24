import { useMemo, useState } from "react";
import type { OwnerInfo } from "../types";

export function useOwnerSearch(initialOwners: OwnerInfo[]) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredOwners = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return initialOwners;

        return initialOwners.filter(item => item.owner.toLowerCase().includes(query));
    }, [initialOwners, searchTerm]);

    return { searchTerm, setSearchTerm, filteredOwners };
}