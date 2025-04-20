'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FoodItemForm from '@/components/food-share/FoodItemForm';

export default function NewFoodShare() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        document.title = 'BananAI - Share New Food';
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const handleSubmit = async (formData) => {
        setLoading(true);
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        try {
            const response = await fetch('/api/food-share', {
                method: 'POST',
                body: form,
            });

            if (response.ok) {
                router.push('/food-share');
            } else {
                alert('Failed to create item');
            }
        } catch (error) {
            alert('Error creating item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-black">Share Food Item</h1>
                <FoodItemForm 
                    onSubmit={handleSubmit}
                    buttonText={loading ? 'Creating...' : 'Share Item'}
                />
            </div>
        </div>
    );
}