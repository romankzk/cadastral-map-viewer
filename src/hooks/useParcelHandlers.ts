import type { Feature } from "geojson";
import { useCallback, useEffect, useRef } from "react";
import type { Owner, ParcelDetailed, ParcelBasic, HoveredParcel } from "../types";
import { useTranslation } from "react-i18next";
import { ParcelStyles, ParcelTypes } from "../types/constants";
import type { Layer, LeafletMouseEvent } from "leaflet";
import { getFeatureStyle } from "../utils/style-utils";

interface UseParcelHandlersProps {
    mode: "basic" | "detailed"
    owners: Owner[];
    selectedOwner: Owner | null;
    setSelectedOwner: (owner: Owner | null) => void;
    setHoveredParcel: (data: HoveredParcel | null) => void;
}

export function useParcelHandlers({
    mode,
    owners,
    selectedOwner,
    setSelectedOwner,
    setHoveredParcel,
}: UseParcelHandlersProps) {
    const { i18n } = useTranslation();
    const ownersRef = useRef<Owner[]>(owners);

    useEffect(() => {
        ownersRef.current = owners;
    }, [owners]);

    const findMatchingOwner = useCallback((feature: Feature): Owner | false => {
        if (!feature.properties) return false;

        const currentOwners = ownersRef.current;

        if (mode === "detailed") {
            const props = feature.properties as ParcelDetailed;
            const houseNum = props.house_number ? parseInt(props.house_number) : 0;
            const ownerNameUk = (props.owner_uk || '').trim();
            const ownerNamePl = (props.owner_pl || '').trim();
            const ownerName = i18n.language === 'uk' ? ownerNameUk : ownerNamePl;

            return currentOwners.find(o => o.ownerName === ownerName && o.houseNumber === houseNum) || false;
        } else {
            const props = feature.properties as ParcelBasic;
            const parcelNum = props.parcel_number ? parseInt(props.parcel_number) : 0;

            return currentOwners.find(o => {
                if (props.parcel_type === ParcelTypes.Build) {
                    return o.buildParcels?.includes(parcelNum);
                } else {
                    return o.landParcels?.includes(parcelNum);
                }
            }) || false;
        }
    }, [mode, i18n.language]);

    const isFeatureSelected = useCallback((feature: Feature | undefined): boolean => {
        if (!selectedOwner || !feature?.properties) return false;

        if (mode === "detailed") {
            const props = feature.properties as ParcelDetailed;
            const ownerNameUk = (props.owner_uk || '').trim();
            const ownerNamePl = (props.owner_pl || '').trim();
            const localizedOwner = i18n.language === 'uk' ? ownerNameUk : ownerNamePl;
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

        let hoveredParcel: HoveredParcel;
        const matchingOwner = findMatchingOwner(feature);

        if (mode === "detailed") {
            const props = feature.properties as ParcelDetailed;
            hoveredParcel = { ...props };
        } else {
            const props = feature.properties as ParcelBasic;
            hoveredParcel = {
                ...props,
                ownerName: matchingOwner ? matchingOwner.ownerName : undefined,
                houseNumber: matchingOwner ? matchingOwner.houseNumber : undefined
            }
        }

        setHoveredParcel(hoveredParcel);
    }, [findMatchingOwner, mode, setHoveredParcel]);

    const onParcelOut = useCallback((e: LeafletMouseEvent, feature: Feature) => {
        setHoveredParcel(null);
        if (isFeatureSelected(feature)) {
            e.target.setStyle(ParcelStyles.selected);
            return;
        }

        const featureProperties = feature.properties;
        const featureType = featureProperties?.type || featureProperties?.land_category;
        e.target.setStyle(getFeatureStyle(featureType));
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
