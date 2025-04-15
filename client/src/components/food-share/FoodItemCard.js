'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
        <motion.div
            whileHover={isClickable ? { scale: 1.02 } : {}}
            transition={{ duration: 0.2 }}
        >
            <Card className="overflow-hidden">
                <div 
                    onClick={handleClick}
                    className={isClickable ? "cursor-pointer" : ""}
                >
                    <div className="relative h-48 w-full">
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2">{item.description}</p>
                        <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                        {item.postedByName && (
                            <p className="text-sm text-muted-foreground">Posted by: {item.postedByName}</p>
                        )}
                    </CardContent>
                </div>

                {(showActions || showContact) && (
                    <CardFooter className="flex flex-col gap-2">
                        {showActions && !item.isDonated && (
                            <div className="flex gap-2 w-full">
                                <Button
                                    onClick={() => router.push(`/food-share/edit/${item._id}`)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => onMarkDonated(item._id)}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Mark as Donated
                                </Button>
                            </div>
                        )}

                        {showActions && (
                            <Button
                                onClick={() => onDelete(item._id)}
                                variant="destructive"
                                className="w-full"
                            >
                                Delete
                            </Button>
                        )}

                        {showContact && !item.isDonated && (
                            <Button
                                asChild
                                variant="default"
                                className="w-full"
                            >
                                <a href={`mailto:${item.postedBy}`}>
                                    Contact
                                </a>
                            </Button>
                        )}
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
}