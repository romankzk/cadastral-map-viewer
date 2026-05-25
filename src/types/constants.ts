import type { PathOptions } from "leaflet";

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