// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

// POST: Create a new product
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as File;

    if (!name || !price || !image) {
      return NextResponse.json({ message: 'Name, price, and image are required.' }, { status: 400 });
    }

    // Convert file to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    
    // Upload image to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(imageBuffer);
    
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl: cloudinaryResponse.secure_url,
      },
    });
    
    console.log('[API ADMIN]: New product created:', newProduct.id);
    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error) {
    console.error('[API ADMIN PRODUCTS POST] Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}