import type { PathOptions } from "leaflet";
import { ParcelStyles } from "../types/constants";

export function getFeatureStyle(featureType: string): PathOptions {
    return ParcelStyles[featureType] || ParcelStyles.default;
}