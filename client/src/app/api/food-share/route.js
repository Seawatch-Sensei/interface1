import { FoodShareItem } from '../db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import multer from 'multer';
import fs from 'fs';
import { promisify } from 'util';
import connectDB from '../../lib/mongodb';

const upload = multer({ dest: '/tmp/' });
const unlinkAsync = promisify(fs.unlink);

export async function GET(request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        
        const query = search 
            ? { 
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ],
                isDonated: false
            }
            : { isDonated: false };

        const items = await FoodShareItem.find(query).sort({ createdAt: -1 }).maxTimeMS(30000);
        return Response.json(items);
    } catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}

export async function POST(request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return new Promise((resolve) => {
        upload.single('image')(request, {
            status: (code) => ({
                json: (data) => resolve(Response.json(data, { status: code })),
                send: (data) => resolve(new Response(data, { status: code })),
                setHeader: () => {},
            }),
            json: async () => request.formData(),
        }, async (err) => {
            if (err) {
                return resolve(Response.json({ error: "Failed to upload image" }, { status: 500 }));
            }

            try {
                const formData = await request.formData();
                const title = formData.get('title');
                const description = formData.get('description');
                const location = formData.get('location');
                const imageUrl = formData.get('imageUrl');

                const item = new FoodShareItem({
                    title,
                    description,
                    location,
                    imageUrl: imageUrl, // You'll need to implement proper image storage
                    postedBy: session.user.email,
                    postedByName: session.user.name
                });

                await item.save();
                resolve(Response.json(item));
            } catch (error) {
                console.log(error)
                resolve(Response.json({ error: "Failed to create item" }, { status: 500 }));
            }
        });
    });
}

export async function PATCH(request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { itemId } = data;

    try {
        const item = await FoodShareItem.findById(itemId);
        if (item.postedBy !== session.user.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        item.isDonated = true;
        await item.save();
        return Response.json(item);
    } catch (error) {
        return Response.json({ error: "Failed to update item" }, { status: 500 });
    }
}