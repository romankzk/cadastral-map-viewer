import { useEffect, useState } from "react";
import type { OwnerInfo } from "../types";
import type { Feature } from 'geojson';

export function useGeojsonData() {
    const [data, setData] = useState(null);
    const [owners, setOwners] = useState<OwnerInfo[]>([]);
    const fetchUrl = `${import.meta.env.BASE_URL}data/parcels.geojson`;

    useEffect(() => {
        fetch(fetchUrl)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch parcel layer data');
                return res.json();
            })
            .then((data) => {
                setData(data);

                if (data && data.features) {
                    const ownersMap: { [key: string]: OwnerInfo } = {};

                    data.features.forEach((feature: Feature) => {
                        const ownerName = feature.properties?.owner?.trim();
                        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
                        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
                        const locality = feature?.properties?.locality;

                        if (ownerName && ownerName !== '' && houseNum) {
                            const uniqueKey = `${ownerName}-${houseNum}`;

                            if (!ownersMap[uniqueKey]) {
                                ownersMap[uniqueKey] = {
                                    id: uniqueKey,
                                    owner: ownerName,
                                    houseNumbers: [houseNum],
                                    locality: locality
                                };
                            }
                        }
                    });

                    const baseOwnersList = Object.values(ownersMap);

                    const sortedOwnersByHouse = baseOwnersList.sort((a, b) => {
                        const houseA = a.houseNumbers[0] ? a.houseNumbers[0] : Number.MAX_SAFE_INTEGER;
                        const houseB = b.houseNumbers[0] ? b.houseNumbers[0] : Number.MAX_SAFE_INTEGER;
                        return houseA - houseB;
                    });

                    setOwners(sortedOwnersByHouse);
                }
            })
            .catch((err) => console.error(err));
    }, [fetchUrl]);

    return { data, owners }
}