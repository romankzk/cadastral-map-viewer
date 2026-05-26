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