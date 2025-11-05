import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

export function useSidebarCollapse(initialState = false) {
    const [isCollapsed, setIsCollapsed] = useState(initialState);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    const toggle = useCallback(() => {
        setIsCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const setCollapsed = useCallback((value: boolean) => {
        setIsCollapsed(value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }, []);

    return { isCollapsed, toggle, setCollapsed };
}