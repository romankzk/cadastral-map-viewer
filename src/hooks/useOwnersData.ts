import { useEffect, useState } from "react";
import type { Owner } from "../types";
import { extractOwnersDataFromGeojson, sortOwnersByHouse } from "../utils/transformers";

export function useOwnersData(filename: string, isGeojson: boolean = false) {
    const [owners, setOwners] = useState<Owner[]>([]);
    const fetchUrl = `${import.meta.env.BASE_URL}data/${filename}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();

                if (isGeojson) {
                    const rawData = extractOwnersDataFromGeojson(data);
                    setOwners(sortOwnersByHouse(rawData));
                } else {
                    setOwners(sortOwnersByHouse(data));
                }
            }
            catch (error) {
                console.error("Fetch error: ", error);
            }
        }
        fetchData();
    }, [fetchUrl]);

    return { owners }
}