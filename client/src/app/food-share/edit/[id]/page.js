'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FoodItemForm from '@/components/food-share/FoodItemForm';

export default function EditFoodItem({ params }) {
    const router = useRouter();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        document.title = 'BananAI - Edit Food Item';
    }, []);

    useEffect(() => {
        if (params.id) {
            fetchItem();
        }
    }, [params.id]);

    const fetchItem = async () => {
        const response = await fetch(`/api/food-share/${params.id}`);
        const data = await response.json();
        setInitialData(data);
    };

    const handleSubmit = async (formData) => {
        const response = await fetch(`/api/food-share/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            router.push('/food-share/my-posts');
        }
    };

    if (!initialData) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-black">Edit Food Item</h1>
                <FoodItemForm 
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    buttonText="Update Item"
                />
                <button
                    onClick={() => router.push('/food-share/my-posts')}
                    className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}