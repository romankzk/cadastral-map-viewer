import { LayersControl, MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { GeoJSON } from 'react-leaflet/GeoJSON'
import { useEffect, useMemo, useState } from "react";
import OpacitySlider from "../components/OpacitySlider";
import SearchFilter from "../components/SearchFilter";

interface OwnerInfo {
    id?: string;
    owner: string;
    houseNumbers: number[];
    locality?: string;
}

export default function Map() {
    const [opacity, setOpacity] = useState(0.75);
    const [geoJsonData, setGeoJsonData] = useState(null);

    const [owners, setOwners] = useState<OwnerInfo[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<OwnerInfo | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetch('parcels.geojson')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch parcel layer data');
                return res.json();
            })
            .then((data) => {
                setGeoJsonData(data);

                if (data && data.features) {
                    // Use an object map to track unique owners dynamically
                    const ownersMap: { [key: string]: any } = {};

                    data.features.forEach((feature: any) => {
                        const ownerName = feature.properties?.owner?.trim();
                        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
                        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
                        const locality = feature.properties.locality;

                        if (ownerName && ownerName !== '' && houseNum) {
                            // MAGIC FIX: Create a truly unique composite string key combining name AND house number
                            const uniqueKey = `${ownerName}-${houseNum}`;

                            if (!ownersMap[uniqueKey]) {
                                ownersMap[uniqueKey] = {
                                    id: uniqueKey, // Add a dedicated, unique ID string for React keys
                                    owner: ownerName,
                                    // Still keeping this as an array in case a single specific person 
                                    // owns multiple parcel subdivisions (gardens/barns) tied to that SAME house number
                                    houseNumbers: [houseNum],
                                    locality: locality
                                };
                            }
                        }
                    });

                    const baseOwnersList = Object.values(ownersMap);

                    const sortedOwnersByHouse = baseOwnersList.sort((a, b) => {
                        const houseA = a.houseNumbers[0] ? a.houseNumbers[0] : Number.MAX_SAFE_INTEGER;
                        const houseB = b.houseNumbers[0] ? b.houseNumbers[0] : Number.MAX_SAFE_INTEGER;
                        return houseA - houseB;
                    });

                    setOwners(sortedOwnersByHouse);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const filteredOwners = useMemo(() => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return owners;

        return owners.filter(item => {
            const nameMatches = item.owner.toLowerCase().includes(query);
            return nameMatches;
        }
        );
    }, [owners, searchTerm]);

    const ParcelStyles = {
        Default: {
            color: '#e54653',
            weight: 1.5,
            fillColor: '#e3707a',
            fillOpacity: 0.15
        },
        Building: {
            color: '#e54653',
            weight: 1.5,
            fillColor: '#e3d670',
            fillOpacity: 0.5
        },
        Yard: {
            color: '#e54653',
            weight: 1.5,
            fillColor: '#ffd2d6',
            fillOpacity: 0.5
        },
        Household: {
            color: '#e54653',
            weight: 1.5,
            fillColor: '#e3707a',
            fillOpacity: 0.4
        },
        Selected: {
            color: '#ef4444',
            weight: 2,
            fillColor: '#5692d6',
            fillOpacity: 0.5
        }
    };

    function setFeatureStyle(featureType: string) {
        let returnStyle = {};
        switch (featureType) {
            case "building":
                returnStyle = ParcelStyles.Building;
                break;
            case "household":
                returnStyle = ParcelStyles.Household;
                break;
            case "yard":
                returnStyle = ParcelStyles.Yard;
                break;
            default:
                returnStyle = ParcelStyles.Default;
                break;
        }
        return returnStyle;
    }

    const onEachParcel = (feature: any, layer: any) => {
        const rawHouseNum = feature.properties?.house_number || feature.properties?.houseNum;
        const houseNum = rawHouseNum ? parseInt(rawHouseNum, 10) : null;
        const ownerName = feature.properties?.owner?.trim();

        // // Check if properties exist in your GeoJSON file before binding
        // if (feature.properties) {
        //     layer.bindPopup(`
        //         <div class="font-sans p-1">
        //         <h3 class="text-sm font-bold text-slate-800 m-0 border-b border-slate-100 pb-1 mb-1">
        //             ${ownerName}
        //         </h3>
        //         <p class="text-xs text-slate-600 m-0 mt-1">
        //             <b>Номер будинку:</b><br/>${houseNum ?? 'Не вказано'}
        //         </p>
        //         </div>
        //     `);
        // }

        // Visual hover effects setup
        layer.on({
            click: () => {
                if (ownerName && houseNum) {
                    // Find the exact profile item where BOTH name and house are identical
                    const matchingOwner = owners.find(o => o.owner === ownerName && o.houseNumbers.includes(houseNum));

                    if (matchingOwner) {
                        setSelectedOwner(matchingOwner);

                        const targetButton = document.getElementById(`owner-btn-${matchingOwner.id}`);
                        if (targetButton) {
                            targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            },
            mouseover: (e: any) => {
                e.target.setStyle({ weight: 2.5, fillOpacity: 0.3, color: '#e54653' });
            },
            mouseout: (e: any) => {
                const currentOwner = feature.properties?.owner?.trim();
                const currentHouse = feature.properties?.house_number || feature.properties?.houseNum;
                const currentHouseInt = currentHouse ? parseInt(currentHouse, 10) : null;

                // Preserve style only if it matches our precise selected ID signature
                if (
                    selectedOwner &&
                    currentOwner === selectedOwner.owner &&
                    currentHouseInt &&
                    selectedOwner.houseNumbers.includes(currentHouseInt)
                ) {
                    return;
                }
                e.target.setStyle(setFeatureStyle(feature.properties?.type));
            }
        });
    };

    return (
        <div className="flex flex-row w-full h-screen overflow-hidden">
            <aside className="w-80 h-full bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-4 z-10 shrink-0 overflow-y-auto">
                <h2 className="text-lg font-bold text-slate-800">Власники у Ліщоватому</h2>
                <SearchFilter value={searchTerm} onChange={setSearchTerm} />
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                    {filteredOwners.length > 0 ? (
                        filteredOwners.map((ownerObj) => {
                            // Check if this specific item is active using the new composite ID
                            const isSelected = selectedOwner?.id === ownerObj.id;
                            const primaryHouse = ownerObj.houseNumbers.join(', ');

                            return (
                                <button
                                    id={`owner-btn-${ownerObj.id}`}
                                    key={ownerObj.id}
                                    onClick={() => setSelectedOwner(ownerObj)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 block ${isSelected
                                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                                        : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <span className={`text-xs font-bold px-2.5 py-2 rounded ${isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-200/80 text-slate-700'
                                            }`}>
                                            {primaryHouse || '—'}
                                        </span>
                                        <div className="flex-1 gap-1 text-left">
                                            <div className="truncate pl-2 font-semibold">
                                                {ownerObj.owner}
                                            </div>
                                            <div className={`text-xs truncate pl-2 ${isSelected ? 'text-white/60' : 'text-slate-500'}`}>
                                                {ownerObj.locality}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })) : (
                        <div className="text-center py-8 text-sm text-slate-400 font-medium">
                            Власників не знайдено
                        </div>
                    )}
                </div>
            </aside>
            <div className="relative flex-1 h-full bg-slate-100">
                <div className="relative w-full h-[100vh]">
                    <OpacitySlider opacity={opacity} onChange={setOpacity} />

                    <MapContainer className="w-full h-full" center={[49.49888, 22.56085]} zoom={14} preferCanvas={true}>
                        <LayersControl position="topright" collapsed={false}>

                            <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.BaseLayer checked name="Супутникова карта">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            </LayersControl.BaseLayer>

                            <LayersControl.Overlay checked name="Карта 1855 р.">
                                <TileLayer
                                    attribution="Historical Village Cadastre"
                                    url="https://romankzk.github.io/map-tiles-leszczowate/tiles-1855/{z}/{x}/{y}.png"
                                    minZoom={12}
                                    maxZoom={22}
                                    maxNativeZoom={20} // Extrapolates pixels up to zoom 22 if tiles stop at 20
                                    opacity={opacity}
                                />
                            </LayersControl.Overlay>

                            {geoJsonData && (
                                <LayersControl.Overlay checked name="Інтерактивні ділянки">
                                    <GeoJSON
                                        data={geoJsonData}
                                        onEachFeature={onEachParcel}
                                        style={(feature) => {
                                            const currentFeatureHouse = feature?.properties?.house_number || feature?.properties?.houseNum;
                                            const currentFeatureOwner = feature?.properties?.owner?.trim();
                                            const featureHouseInt = currentFeatureHouse ? parseInt(currentFeatureHouse, 10) : null;
                                            const currentFeatureType = feature?.properties.type;

                                            // Crucial check: BOTH the name and the house integer must match perfectly
                                            if (
                                                selectedOwner &&
                                                currentFeatureOwner === selectedOwner.owner &&
                                                featureHouseInt &&
                                                selectedOwner.houseNumbers.includes(featureHouseInt)
                                            ) {
                                                return ParcelStyles.Selected;
                                            }
                                            return setFeatureStyle(currentFeatureType);
                                        }}
                                        // Regenerate instance map based on the composite unique ID string
                                        key={selectedOwner ? `highlight-${selectedOwner.id}` : 'default'}
                                    />
                                </LayersControl.Overlay>
                            )}
                        </LayersControl>
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}