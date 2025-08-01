// app/shop/product/[id]/page.tsx
import React from 'react';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Import the interactive client components for this page
import ProductActions from './ProductActions';
import RatingsSection from './RatingsSection';

// This function calculates the average rating for a product
const calculateAverageRating = (ratings: { value: number }[]) => {
  if (ratings.length === 0) {
    return 0;
  }
  const total = ratings.reduce((acc, rating) => acc + rating.value, 0);
  return total / ratings.length;
};

// This is the main page component. It's a Server Component, so it's async.
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  // We don't need to await `params` in the latest Next.js versions, but destructuring is clean
  const { id } = params;

  // Fetch the product and all its related ratings in a single, efficient database query.
  // We also include the 'user' for each rating to display their name.
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ratings: {
        include: {
          user: {
            select: { name: true, image: true }, // Select only the necessary user fields
          },
        },
        orderBy: {
          createdAt: 'desc', // Show the newest reviews first
        },
      },
    },
  });

  // If no product is found for the given ID, render the standard 404 "Not Found" page.
  if (!product) {
    notFound();
  }
  
  // Calculate the average rating to display at the top of the page.
  const averageRating = calculateAverageRating(product.ratings);

  return (
    <div className="bg-white">
      <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          
          {/* --- Column 1: Product Image --- */}
          <div className="relative w-full aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 bg-gray-200">
                <p>No Image Available</p>
              </div>
            )}
          </div>

          {/* --- Column 2: Product Details and Actions --- */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Average Rating Display */}
            {product.ratings.length > 0 && (
              <div className="flex items-center gap-2 my-4">
                  <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className={`w-5 h-5 ${averageRating >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.175 0l-3.366 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                          </svg>
                      ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {averageRating.toFixed(1)} stars ({product.ratings.length} reviews)
                  </span>
              </div>
            )}

            <p className="text-3xl font-bold text-indigo-600 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 flex-grow">
              {product.description || 'A detailed description is not available for this product.'}
            </p>
            
            {/* Interactive Client Component for Add to Cart/Wishlist buttons */}
            <ProductActions productId={product.id} />
          </div>
        </div>
        
        {/* --- Ratings & Reviews Section --- */}
        {/* Interactive Client Component to display and submit ratings */}
        <RatingsSection productId={product.id} ratings={product.ratings} />
      </section>
    </div>
  );
}