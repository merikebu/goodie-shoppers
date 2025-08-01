// app/api/ratings/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// POST: Submit a new rating for a product
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    try {
        const { productId, value, comment } = await req.json();

        // Basic validation
        if (!productId || !value || value < 1 || value > 5) {
            return NextResponse.json({ message: 'Product ID and a rating value between 1 and 5 are required.' }, { status: 400 });
        }

        const userId = session.user.id;

        // Use upsert to create or update the rating for this user and product
        const rating = await prisma.rating.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
            update: {
                value,
                comment,
            },
            create: {
                userId,
                productId,
                value,
                comment,
            },
        });
        
        console.log(`[API Ratings]: User ${userId} rated product ${productId} with ${value} stars.`);
        return NextResponse.json(rating, { status: 201 });

    } catch (error) {
        console.error('[API RATINGS POST] Error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
    }
}