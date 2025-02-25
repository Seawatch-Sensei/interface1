'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FoodItemCard({ 
    item, 
    onMarkDonated, 
    onDelete, 
    showActions = false,
    showContact = false,
    isClickable = true 
}) {
    const router = useRouter();

    const handleClick = () => {
        if (isClickable) {
            router.push(`/food-share/item/${item._id}`);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-lg">
            <div 
                onClick={handleClick}
                className={isClickable ? "cursor-pointer" : ""}
            >
                <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    unoptimized
                />
                <h2 className="text-xl font-bold mb-2 text-black">{item.title}</h2>
                <p className="mb-2 text-black">{item.description}</p>
                <p className="text-sm text-gray-600">Location: {item.location}</p>
                {item.postedByName && (
                    <p className="text-sm text-gray-600">Posted by: {item.postedByName}</p>
                )}
            </div>

            {showActions && !item.isDonated && (
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => router.push(`/food-share/edit/${item._id}`)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onMarkDonated(item._id)}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Mark as Donated
                    </button>
                </div>
            )}

            {showActions && (
                <button
                    onClick={() => onDelete(item._id)}
                    className="flex-1 w-full mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Delete
                </button>
            )}

            {showContact && !item.isDonated && (
                <a
                    href={`mailto:${item.postedBy}`}
                    className="mt-2 block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Contact
                </a>
            )}
        </div>
    );
}