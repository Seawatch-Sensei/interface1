import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import connectDB from '../../../lib/mongodb';
import { FoodShareItem } from '../../db';

export async function GET(request, { params }) {
    await connectDB();
    const item = await FoodShareItem.findById(params.id);
    return NextResponse.json(item);
}

export async function PUT(request, { params }) {
    await connectDB();
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const result = await FoodShareItem.findOneAndUpdate(
        { _id: params.id, postedBy: session.user.email },
        { $set: data },
        { new: true }
    );

    if (!result) {
        return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
    await connectDB();
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await FoodShareItem.findOneAndDelete({
        _id: params.id,
        postedBy: session.user.email
    });

    if (!result) {
        return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}