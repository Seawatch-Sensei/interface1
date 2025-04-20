'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        
        if (status === 'unauthenticated' && pathname !== '/login') {
            redirect('/login');
        }
    }, [status, pathname]);

    return <>{children}</>;
}