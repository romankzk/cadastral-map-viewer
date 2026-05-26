import type { Owner } from "../types";
import type { Feature } from 'geojson';

export function extractOwnersDataFromGeojson(geojsonData: any): Owner[] {
    const ownersMap: { [key: string]: Owner } = {};

    geojsonData.features.forEach((feature: Feature) => {
        const ownerName = feature.properties?.owner?.trim();
        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
        const locality = feature?.properties?.locality;

        if (ownerName && ownerName !== '' && houseNum) {
            const uniqueKey = `${ownerName}-${houseNum}`;

            if (!ownersMap[uniqueKey]) {
                ownersMap[uniqueKey] = {
                    id: uniqueKey,
                    ownerName: ownerName,
                    houseNumber: houseNum,
                    ownerOrigin: locality
                };
            }
        }
    });

    const baseOwnersList = Object.values(ownersMap);

    return baseOwnersList as Owner[];
}

export function sortOwnersByHouse(ownersList: Owner[]) {
    return ownersList.sort((a, b) => {
        const houseA = a.houseNumber ? a.houseNumber : Number.MAX_SAFE_INTEGER;
        const houseB = b.houseNumber ? b.houseNumber : Number.MAX_SAFE_INTEGER;
        return houseA - houseB;
    });
}