// app/shop/products/page.tsx
// This is a Server Component, so we can directly use Prisma.
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma'; // <-- Importing your actual Prisma client
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';

/**
 * Fetches all products from the database.
 * We've extracted this to its own function for clarity.
 * Next.js can automatically cache the results of data fetches like this.
 */
async function getProductsFromDb() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc', // Show the newest products first
      },
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products from database:", error);
    // In a real production app, you might want more sophisticated error handling or logging.
    return []; // Return an empty array on error so the page doesn't crash.
  }
}

export default async function ProductsPage() {
  // --------------------------------------------------------------------------
  // We now call our function to get REAL data from the PostgreSQL database.
  // The mock data is no longer needed.
  // --------------------------------------------------------------------------
  const products = await getProductsFromDb();

  return (
    <section className="bg-gray-50 flex-grow">
      <div className="container mx-auto p-6 md:p-8 lg:p-10">
        {/* Page Header */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 tracking-tight">
            Our Collection
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Browse our carefully curated selection of high-quality products.
          </p>
        </div>

        {/* Product Grid Section */}
        {products.length === 0 ? (
          // Display a helpful message if no products exist in the database yet
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Nothing to see here yet!</h2>
            <p className="text-gray-500 mt-4">
              It looks like we're still stocking our shelves. Please check back soon.
            </p>
            {/* Optional: Add a link back to the homepage for users */}
            <Link href="/" passHref>
               <Button className="mt-8 bg-[var(--primary-color)] hover:bg-indigo-700 text-white font-semibold">
                Go to Homepage
              </Button>
            </Link>
          </div>
        ) : (
          // If products exist, render them in the grid
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </div>
    </section>
  );
}