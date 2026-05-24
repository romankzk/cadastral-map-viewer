import { useOwnerSearch } from "../hooks/useOwnerSearch";
import type { OwnerInfo } from "../types";
import SearchFilter from "./SearchFilter";

interface OwnersSidebarProps {
    owners: OwnerInfo[];
    selectedOwner: OwnerInfo | null;
    onSelectOwner: (selectedOwner: OwnerInfo) => void;
}

export default function OwnersSidebar({ owners, selectedOwner, onSelectOwner }: OwnersSidebarProps) {
    const { searchTerm, setSearchTerm, filteredOwners } = useOwnerSearch(owners);

    return (
        <aside className="w-80 h-full bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-4 z-10 shrink-0 overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800">Власники у Ліщоватому</h2>
            <SearchFilter value={searchTerm} onChange={setSearchTerm} />
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {filteredOwners.length > 0 ? (
                    filteredOwners.map((ownerObj) => {
                        const isSelected = selectedOwner?.id === ownerObj.id;
                        const primaryHouse = ownerObj.houseNumbers.join(', ');

                        return (
                            <button
                                id={`owner-btn-${ownerObj.id}`}
                                key={ownerObj.id}
                                onClick={() => onSelectOwner(ownerObj)}
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
    )
}