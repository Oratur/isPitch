import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigation() {
    const pathname = usePathname();

    const isActive = useCallback(
        (href: string) => pathname === href,
        [pathname]
    );

    return { pathname, isActive };
}