'use client';
import SignOut from '@/components/SignOut';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation'
import { useEffect } from 'react';

export default function Template({ children }) {
    const { data: session, status } = useSession();
    

    useEffect(() => {
        if (status === 'unauthenticated' && window.location.pathname !== '/login') {
            redirect('/login');
        }
    }, [status]);

    return (
        <body className="antialiased">
            {window.location.pathname !== '/login' && (
                <div className="absolute top-4 left-4 text-sm underline transition-transform transform hover:scale-110 p-2 rounded-lg">
                    <SignOut />
                </div>
            )}
            {children}
        </body>
    );
}