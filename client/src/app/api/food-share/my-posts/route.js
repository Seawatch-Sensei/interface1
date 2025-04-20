import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '../../../../lib/mongodb';
import { FoodShareItem } from '../../../../lib/dbmodels';

export async function GET(request) {
    await connectDB();
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await FoodShareItem.find({ postedBy: session.user.email })
        .sort({ createdAt: -1 });

    return NextResponse.json(items);
}