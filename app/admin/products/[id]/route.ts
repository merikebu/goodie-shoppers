// app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'; // Still needed for destroying images
import { uploadToCloudinary } from '@/lib/cloudinary';

// Note: We no longer need cloudinary.config() here because the SDK
// will automatically pick up the CLOUDINARY_URL environment variable.

// GET: Fetch a single product for pre-filling an edit form
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(`[API ADMIN GET /products/${params.id}] Error:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// PUT: Update an existing product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as File | null;

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    let imageUrl = existingProduct.imageUrl;
    let publicId = existingProduct.publicId;

    // If a new image is being uploaded
    if (image && image.size > 0) {
      // 1. Delete the old image from Cloudinary, if one exists
      if (existingProduct.publicId) {
        console.log(`[Cloudinary] Deleting old image: ${existingProduct.publicId}`);
        await cloudinary.uploader.destroy(existingProduct.publicId);
      }
      
      // 2. Upload the new image to Cloudinary
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const cloudinaryResponse = await uploadToCloudinary(imageBuffer);
      imageUrl = cloudinaryResponse.secure_url;
      publicId = cloudinaryResponse.public_id;
      console.log(`[Cloudinary] Uploaded new image: ${publicId}`);
    }

    // 3. Update the product record in the database
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        imageUrl,
        publicId,
      },
    });

    console.log(`[API ADMIN] Product updated: ${updatedProduct.id}`);
    return NextResponse.json(updatedProduct, { status: 200 });

  } catch (error) {
    console.error(`[API ADMIN PUT /products/${params.id}] Error:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

// DELETE: Remove a product entirely
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // 1. Delete the image from Cloudinary if it has a publicId
    if (product.publicId) {
      console.log(`[Cloudinary] Deleting image: ${product.publicId}`);
      await cloudinary.uploader.destroy(product.publicId);
    }

    // 2. Delete the product from the database
    await prisma.product.delete({
      where: { id: params.id },
    });

    console.log(`[API ADMIN] Product deleted: ${params.id}`);
    return NextResponse.json({ message: 'Product deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error(`[API ADMIN DELETE /products/${params.id}] Error:`, error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}