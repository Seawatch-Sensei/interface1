import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/mongodb';
import { FoodShareItem } from '../../../../lib/dbmodels';

/**
 * Retrieves a specific food share item by ID
 * @route GET /api/food-share/[id]
 */
export async function GET(request, { params }) {
    const { id } = await params;
    
    try {
        await connectDB();
        const item = await FoodShareItem.findById(id);
        
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
    }
}

/**
 * Updates a food share item if the user owns it
 * @route PUT /api/food-share/[id]
 * @authentication Required
 */
export async function PUT(request, { params }) {
    const { id } = await params;
    
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const result = await FoodShareItem.findOneAndUpdate(
            { _id: id, postedBy: session.user.email },
            { $set: data },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}

/**
 * Deletes a food share item if the user owns it
 * @route DELETE /api/food-share/[id]
 * @authentication Required
 */
export async function DELETE(request, { params }) {
    const { id } = await params;
    
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await FoodShareItem.findOneAndDelete({
            _id: id,
            postedBy: session.user.email
        });

        if (!result) {
            return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}