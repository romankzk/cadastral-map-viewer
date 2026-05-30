export interface Owner {
    id?: string
    orderNumber?: number
    houseNumber?: number
    ownerOriginal?: string
    ownerName: string
    ownerStatus?: string
    ownerOrigin: string
    note?: string
    buildParcels?: number[]
    landParcels?: number[]
}

export interface ParcelDetailed {
    fid: number
    cadastral_number?: string
    house_number: string
    type?: "household" | "yard" | "building" | "forest"
    owner_uk: string
    locality_uk: string
    owner_pl: string
    locality_pl: string
}

export type ParcelType = "build" | "ground";
export type LandCategory = "garden" | "field" | "water" | "orchard" | "pasture" | "common_pasture" | "building" | "yard" | "forest";

export interface ParcelBasic {
    fid: number
    parcel_number?: string
    parcel_type: ParcelType
    land_category?: LandCategory
}

export interface HoveredParcel {
    parcel_number?: string | number
    owner_uk?: string
    owner_pl?: string
    ownerName?: string
    houseNumber?: string | number
    house_number?: string
    land_category?: LandCategory
    type?: "household" | "yard" | "building" | "forest"
    parcel_type?: ParcelType
};