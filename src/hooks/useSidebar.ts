import { useState } from "react";

export function useSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapsedChange = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
        } else {
            setIsCollapsed(true);
        }
    };

    return { isCollapsed, handleCollapsedChange };
}