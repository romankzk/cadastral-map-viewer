import type { PathOptions } from "leaflet";

export const ParcelStyles: Record<string, PathOptions> = {
    default: {
        color: '#e54653',
        weight: 1.5,
        fillColor: '#e3707a',
        fillOpacity: 0.15
    },
    building: {
        color: '#e54653',
        weight: 1.5,
        fillColor: '#e3d670',
        fillOpacity: 0.5
    },
    yard: {
        color: '#e54653',
        weight: 1.5,
        fillColor: '#ffd2d6',
        fillOpacity: 0.5
    },
    household: {
        color: '#e54653',
        weight: 1.5,
        fillColor: '#e3707a',
        fillOpacity: 0.4
    },
    selected: {
        color: '#ef4444',
        weight: 2,
        fillColor: '#5692d6',
        fillOpacity: 0.5
    },
    hover: {
        weight: 2.5, 
        fillOpacity: 0.3, 
        color: '#e54653'
    }
} as const;