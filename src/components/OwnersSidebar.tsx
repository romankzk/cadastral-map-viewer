import { ArrowLeft, CircleUserRound } from "lucide-react";
import { useOwnerSearch } from "../hooks/useOwnerSearch";
import type { Owner } from "../types";
import SearchFilter from "./SearchFilter";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface OwnersSidebarProps {
    titleText: string
    owners: Owner[]
    isSelectable: boolean
    selectedOwner?: Owner | null;
    onSelectOwner?: (selectedOwner: Owner) => void
    isCollapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
    onDetailsClick?: (ownerData: Owner) => void
}

export default function OwnersSidebar({ titleText, owners, isSelectable = true, selectedOwner, onSelectOwner, isCollapsed, onDetailsClick }: OwnersSidebarProps) {
    const { searchTerm, setSearchTerm, filteredOwners } = useOwnerSearch(owners);
    const { t } = useTranslation();

    return (
        <>
            <aside className={`fixed md:relative left-0 bottom-0 md:top-0 w-full md:w-80 h-[50vh] md:h-full bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-4 z-500 shrink-0 overflow-y-auto 
                ${isCollapsed
                    ? '-translate-x-full md:w-0 md:overflow-hidden md:p-0 md:border-none'
                    : 'translate-x-0'}`}
            >
                <div className="flex flex-row items-center gap-2">
                    <Link
                        to={'/'}
                        className="text-xs px-1 py-1 rounded text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <h2 className="text-lg font-bold text-slate-800">{titleText}</h2>
                </div>

                <SearchFilter value={searchTerm} onChange={setSearchTerm} />

                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                    {filteredOwners.length > 0 ? (
                        filteredOwners.map((ownerObj) => {
                            const isSelected = isSelectable ? selectedOwner?.id === ownerObj.id : false;

                            return (
                                <OwnerRow
                                    owner={ownerObj}
                                    isSelectable={isSelectable}
                                    isSelected={isSelected}
                                    onRowSelect={onSelectOwner}
                                    onDetailsClick={onDetailsClick}
                                />
                            )
                        })) : (
                        <div className="text-center py-8 text-sm text-slate-400 font-medium">
                            {t('sidebar.searchNotFound')}
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

function OwnerRow({ owner, isSelectable, isSelected, onRowSelect, onDetailsClick }: {
    owner: Owner,
    isSelectable: boolean,
    isSelected: boolean,
    onRowSelect?: (owner: Owner) => void
    onDetailsClick?: (owner: Owner) => void
}) {
    return (
        <div
            id={`owner-btn-${owner.id}`}
            key={owner.id}
            onClick={isSelectable && onRowSelect ? () => onRowSelect(owner) : undefined}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 block ${isSelectable && isSelected
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
        >
            <div className="flex flex-row justify-between items-center w-full">
                <div className={`text-xs font-bold px-2.5 py-2 rounded ${isSelectable && isSelected
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-200/80 text-slate-700'}`}
                >
                    {owner.houseNumber || '—'}
                </div>
                <div className="flex flex-col truncate flex-1 gap-1 text-left max-w-full">
                    <div className="px-2 font-semibold">
                        {owner.ownerName}
                    </div>
                    <div className={`text-xs px-2 ${isSelectable && isSelected ? 'text-white/60' : 'text-slate-500'}`}>
                        {owner.ownerOrigin}
                    </div>
                </div>
                
                <button
                    onClick={onDetailsClick ? (e) => {
                        e.stopPropagation();
                        onDetailsClick(owner)
                    } : undefined}
                    className={`text-xs px-1 py-1 rounded cursor-pointer transition-colors ${isSelectable && isSelected
                        ? 'text-blue-100/80 hover:bg-blue-700'
                        : 'text-slate-700 hover:bg-slate-200'}`}
                >
                    <CircleUserRound size={18} />
                </button>
            </div>
        </div>
    );
}