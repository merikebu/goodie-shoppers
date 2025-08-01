// app/api/cart/items/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// GET: Fetch all items from the current user's cart
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    try {
        const userId = session.user.id;
        
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true, // Include the full product details for each cart item
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        
        return NextResponse.json(cartItems, { status: 200 });

    } catch (error) {
        console.error('[API CART GET] Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}