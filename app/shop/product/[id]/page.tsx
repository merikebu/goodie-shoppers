// app/shop/product/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductActions from './ProductActions';

// Note the props type now reflects that params can be a promise
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // --- THIS IS THE FIX ---
  // Await the params object before destructuring the id
  const { id } = await params;
  // ---------------------

  // Fetch the product from the database
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // If no product is found, show the 404 page
  if (!product) {
    notFound();
  }

  return (
    <section className="container mx-auto p-6 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-indigo-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {product.description || 'A detailed description is not available for this product.'}
          </p>

          {/* Interactive buttons */}
          <div className="mt-auto space-y-4">
             <ProductActions productId={product.id} />
          </div>
        </div>
      </div>

      {/* Ratings/Reviews section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Ratings & Reviews
        </h2>
        <p className="text-gray-600">The ratings and reviews section will be implemented here.</p>
      </div>
    </section>
  );
}