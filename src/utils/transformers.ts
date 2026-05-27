import type { Owner } from "../types";
import type { Feature, FeatureCollection } from 'geojson';

export function extractOwnersDataFromGeojson(geojsonData: FeatureCollection, lang: string): Owner[] {
    const ownersMap: { [key: string]: Owner } = {};

    geojsonData.features.forEach((feature: Feature) => {
        const ownerName = lang === 'uk' ? feature?.properties?.owner_uk?.trim() : feature?.properties?.owner_pl?.trim();
        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
        const locality = lang === 'uk' ? feature?.properties?.locality_uk?.trim() : feature?.properties?.locality_pl?.trim();

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