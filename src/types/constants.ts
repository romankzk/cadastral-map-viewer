import type { LatLngBoundsExpression, PathOptions } from "leaflet";

export const Colors = {
    Red500: "#ef4444",
    Red100: "#fee2e2",
    Amber500: "#f59e0b",
    Blue500: "#3b82f6",
}

export const ParcelStyles: Record<string, PathOptions> = {
    default: {
        color: Colors.Red500,
        weight: 1,
        fillColor: Colors.Red500,
        fillOpacity: 0.15
    },
    building: {
        color: Colors.Red500,
        weight: 1.5,
        fillColor: Colors.Amber500,
        fillOpacity: 0.5
    },
    yard: {
        color: Colors.Red500,
        weight: 1,
        fillColor: Colors.Red100,
        fillOpacity: 0.5
    },
    household: {
        color: Colors.Red500,
        weight: 1,
        fillColor: Colors.Red500,
        fillOpacity: 0.4
    },
    selected: {
        color: Colors.Red500,
        weight: 2.5,
        fillColor: Colors.Blue500,
        fillOpacity: 0.5
    },
    hover: {
        weight: 2.5,
        fillOpacity: 0.5,
        color: Colors.Red500
    }
} as const;

export type MapConfig = {
    center: [number, number],
    zoom: number,
    bounds: LatLngBoundsExpression
}

export const MapConfig: Record<string, MapConfig> = {
    Perehnoiv: {
        center: [49.80731, 24.57350],
        zoom: 14,
        bounds: [
            [49.74678, 24.46878], // South-West corner
            [49.85103, 24.67981]  // North-East corner
        ]
    },
    Leszczowate: {
        center: [49.49888, 22.56085],
        zoom: 14,
        bounds: [
            [49.45284, 22.39202], // South-West corner
            [49.56208, 22.70720]  // North-East corner
        ]
    },
    Deszno: {
        center: [49.53964, 21.83833],
        zoom: 14,
        bounds: [
            [49.50308, 21.70761], // South-West corner
            [49.56558, 21.93377]  // North-East corner
        ]
    }
}