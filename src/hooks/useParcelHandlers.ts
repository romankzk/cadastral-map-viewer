import type { Feature } from "geojson";
import { useCallback } from "react";
import type { Owner, ParcelDetailed, ParcelBasic } from "../types";
import { useTranslation } from "react-i18next";
import { ParcelStyles, ParcelTypes } from "../types/constants";
import type { Layer, LeafletMouseEvent } from "leaflet";
import { getFeatureStyle } from "../utils/style-utils";

interface UseParcelHandlersProps {
    mode: "basic" | "detailed"
    owners: Owner[];
    selectedOwner: Owner | null;
    setSelectedOwner: (owner: Owner | null) => void;
    setHoveredParcel: (data: any | null) => void;
}

export function useParcelHandlers({
    mode,
    owners,
    selectedOwner,
    setSelectedOwner,
    setHoveredParcel,
}: UseParcelHandlersProps) {
    const { i18n } = useTranslation();

    const findMatchingOwner = useCallback((feature: Feature): Owner | false => {
        if (!feature.properties) return false;

        if (mode === "detailed") {
            const props = feature.properties as ParcelDetailed;
            const houseNum = props.house_number ? parseInt(props.house_number) : 0;
            const ownerName = i18n.language === 'uk' ? props.owner_uk.trim() : props.owner_pl.trim();

            return owners.find(o => o.ownerName === ownerName && o.houseNumber === houseNum) || false;
        } else {
            const props = feature.properties as ParcelBasic;
            const parcelNum = props.parcel_number ? parseInt(props.parcel_number) : 0;

            return owners.find(o => {
                if (props.parcel_type === ParcelTypes.Build) {
                    return o.buildParcels?.includes(parcelNum);
                } else {
                    return o.landParcels?.includes(parcelNum);
                }
            }) || false;
        }
    }, [mode, owners, i18n.language]);

    const isFeatureSelected = useCallback((feature: Feature | undefined): boolean => {
        if (!selectedOwner || !feature?.properties) return false;

        if (mode === "detailed") {
            const props = feature.properties as ParcelDetailed;
            const localizedOwner = i18n.language === 'uk' ? props.owner_uk.trim() : props.owner_pl.trim();
            const houseNum = parseInt(props.house_number, 10);

            return (
                localizedOwner === selectedOwner.ownerName &&
                !isNaN(houseNum) &&
                selectedOwner.houseNumber === houseNum
            );
        } else {
            const props = feature.properties as ParcelBasic;
            const parcelNum = props.parcel_number ? parseInt(props.parcel_number) : 0;

            if (props.parcel_type === ParcelTypes.Build) {
                return selectedOwner.buildParcels?.includes(parcelNum) ?? false;
            } else {
                return selectedOwner.landParcels?.includes(parcelNum) ?? false;
            }
        }
    }, [mode, selectedOwner, i18n.language]);

    const onParcelClick = useCallback((feature: Feature): void => {
        const matchingOwner = findMatchingOwner(feature);

        if (matchingOwner) {
            setSelectedOwner(matchingOwner);

            const targetButton = document.getElementById(`owner-btn-${matchingOwner.id}`);
            if (targetButton) {
                targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [findMatchingOwner, setSelectedOwner]);

    const onParcelOver = useCallback((e: LeafletMouseEvent, feature: Feature): void => {
        e.target.setStyle(ParcelStyles.hover);
        const props = feature.properties || {};

        const matchingOwner = findMatchingOwner(feature);

        if (matchingOwner) {
            let parcelObj = mode === "detailed"
                ? { ...props }
                : {
                    ...props,
                    ownerName: matchingOwner.ownerName,
                    houseNumber: matchingOwner.houseNumber
                }
            setHoveredParcel(parcelObj);
        }
    }, [findMatchingOwner, mode, setHoveredParcel]);

    const onParcelOut = useCallback((e: LeafletMouseEvent, feature: Feature) => {
        setHoveredParcel(null);
        if (isFeatureSelected(feature)) {
            e.target.setStyle(ParcelStyles.selected);
            return;
        }

        e.target.setStyle(getFeatureStyle(feature.properties?.type
            ? feature.properties?.type
            : feature.properties?.land_category));
    }, [isFeatureSelected, setHoveredParcel]);

    const onFeatureStyle = useCallback((feature: Feature | undefined) => {
        const featureType = feature?.properties?.land_category
            ? feature?.properties?.land_category
            : feature?.properties?.type;

        if (isFeatureSelected(feature)) {
            return ParcelStyles.selected;
        }
        return getFeatureStyle(featureType);
    }, [isFeatureSelected]);

    const onEachParcel = useCallback((feature: Feature, layer: Layer) => {
        layer.on({
            click: () => onParcelClick(feature),
            mouseover: (e) => onParcelOver(e, feature),
            mouseout: (e) => onParcelOut(e, feature)
        });
    }, [onParcelClick, onParcelOver, onParcelOut]);

    return { onFeatureStyle, onEachParcel }
}
