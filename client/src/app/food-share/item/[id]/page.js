'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ItemDetail({ params }) {
    const [item, setItem] = useState(null);
    const { data: session } = useSession();

    useEffect(() => {
        document.title = 'BananAI - Food Item Details';
    }, []);

    const router = useRouter();

    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = async () => {
        const response = await fetch(`/api/food-share/${params.id}`);
        if (response.ok) {
            const data = await response.json();
            setItem(data);
        }
    };

    const markAsDonated = async () => {
        if (confirm('Are you sure you want to mark this item as donated?')) {
            const response = await fetch('/api/food-share', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: params.id })
            });
            if (response.ok) {
                fetchItem();
            }
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this item?')) {
            const response = await fetch(`/api/food-share/${params.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                router.push('/food-share/my-posts');
            }
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={800}
                        height={400}
                        className="w-full h-96 object-cover"
                        unoptimized
                    />
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                            <span className={`px-3 py-1 rounded-full ${
                                item.isDonated 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {item.isDonated ? 'Donated' : 'Available'}
                            </span>
                        </div>
                        <p className="text-gray-700 text-lg mb-4">{item.description}</p>
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-gray-600"><strong>Location:</strong> {item.location}</p>
                            <p className="text-gray-600"><strong>Posted by:</strong> {item.postedByName}</p>
                            <p className="text-gray-600">
                                <strong>Contact:</strong> {item.postedBy}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <Link 
                                href="/food-share/my-posts" 
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Back to My Posts
                            </Link>
                            {session?.user.email === item.postedBy && !item.isDonated && (
                                <>
                                    <button
                                        onClick={() => router.push(`/food-share/edit/${item._id}`)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={markAsDonated}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Mark as Donated
                                    </button>
                                </>
                            )}
                            {session?.user.email === item.postedBy && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}