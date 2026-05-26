import { useMemo, useState } from "react";
import type { Owner } from "../types";

export function useOwnerSearch(initialOwners: Owner[]) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredOwners = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return initialOwners;

        return initialOwners.filter(item => item.ownerName.toLowerCase().includes(query));
    }, [initialOwners, searchTerm]);

    return { searchTerm, setSearchTerm, filteredOwners };
}