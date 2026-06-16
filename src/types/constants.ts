import type { LatLngBoundsExpression, PathOptions } from "leaflet";
import type { LandCategory, ParcelType } from ".";

export const Colors = {
    Red500: "#ef4444",
    Red100: "#fee2e2",
    Amber500: "#f59e0b",
    Blue500: "#3b82f6",
    Cyan300: "#67e8f9",
    Green300: "#86efac",

    Green500: "#22c55e", // Garden + Orchard
    Emerald500: "#10b981", // Pasture
    Green900: "#14532d", // Forest
    Blue600: "#2563eb", // Water
    Amber600: "#d97706", // Field
    Amber100: "#fef3c7", // Yard
    Cyan500: "#06b6d4", // Selected
}

const baseParcelStyle = {
    color: Colors.Red500,
    weight: 1,
    fillColor: Colors.Red500,
    fillOpacity: 0.15
}

export const ParcelStyles: Record<string, PathOptions> = {
    default: baseParcelStyle,
    building: {
        ...baseParcelStyle,
        fillColor: Colors.Amber500,
        fillOpacity: 0.5
    },
    yard: {
        ...baseParcelStyle,
        fillColor: Colors.Amber100,
        fillOpacity: 0.5
    },
    household: {
        ...baseParcelStyle,
        fillOpacity: 0.4
    },
    garden: {
        ...baseParcelStyle,
        fillColor: Colors.Green500,
        fillOpacity: 0.4
    },
    orchard: {
        ...baseParcelStyle,
        fillColor: Colors.Green500,
        fillOpacity: 0.4
    },
    pasture: {
        ...baseParcelStyle,
        fillColor: Colors.Emerald500,
        fillOpacity: 0.2
    },
    common_pasture: {
        ...baseParcelStyle,
        fillColor: Colors.Emerald500,
        fillOpacity: 0.2
    },
    field: {
        ...baseParcelStyle,
        fillColor: Colors.Amber600,
        fillOpacity: 0.2
    },
    wetland: {
        ...baseParcelStyle,
        fillColor: Colors.Green300,
        fillOpacity: 0.2
    },
    water: {
        ...baseParcelStyle,
        fillColor: Colors.Blue600,
        fillOpacity: 0.15
    },
    forest: {
        ...baseParcelStyle
    },
    selected: {
        ...baseParcelStyle,
        weight: 2.5,
        fillColor: Colors.Cyan500,
        color: Colors.Red500,
        fillOpacity: 0.8
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
        center: [49.81921, 24.58419],
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

export const ParcelTypes: Record<string, ParcelType> = {
    Build: "build",
    Land: "ground"
} as const;

export const LangCategories: Record<string, LandCategory> = {
    Garden: "garden",
    Orchard: "orchard",
    Yard: "yard",
    Building: "building",
    Field: "field",
    Pasture: "pasture",
    CommonPasture: "common_pasture",
    Water: "water",
    Forest: "forest"
} as const;