// app/api/wishlist/items/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// GET: Fetch all items from the current user's wishlist
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    try {
        const userId = session.user.id;
        
        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true, // Include the full product details
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        return NextResponse.json(wishlistItems, { status: 200 });

    } catch (error) {
        console.error('[API WISHLIST GET] Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}