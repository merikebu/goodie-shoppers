// app/shop/products/page.tsx
// This is a Server Component, it does NOT have 'use client'
import React from 'react';
import ProductCard from '@/components/ProductCard';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types'; // Import the Product interface

// --- MOCK DATA ---
// In a real application, you would fetch this from your database using Prisma.
const getMockProducts = (): Product[] => {
  return [
    {
      id: 'prod_1',
      name: 'Luxury Smartwatch',
      description: 'A stylish and powerful smartwatch with advanced health tracking and notifications. Crafted with premium materials for a sleek look.',
      price: 299.99,
      imageUrl: '/images/smartwatch.jpg', // You need to place an image here or use an external URL
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_2',
      name: 'Noise-Cancelling Headphones',
      description: 'Immersive sound experience with industry-leading noise cancellation. Perfect for travel and focus.',
      price: 199.50,
      imageUrl: '/images/headphones.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_3',
      name: 'Ergonomic Office Chair',
      description: 'Designed for ultimate comfort and support during long working hours. Fully adjustable for personalized posture.',
      price: 450.00,
      imageUrl: '/images/office-chair.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_4',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact yet powerful, delivering crisp audio and deep bass. Ideal for outdoor adventures and parties.',
      price: 75.00,
      imageUrl: '/images/bluetooth-speaker.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_5',
      name: 'High-Performance Laptop',
      description: 'Blazing fast processing power and stunning graphics for gaming, creativity, and professional tasks.',
      price: 1200.00,
      imageUrl: '/images/laptop.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_6',
      name: 'Designer Coffee Mug',
      description: 'Start your day in style with this beautifully designed ceramic coffee mug. Microwave and dishwasher safe.',
      price: 15.99,
      imageUrl: '/images/coffee-mug.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_7',
      name: 'Smartphone Gimbal Stabilizer',
      description: 'Capture cinematic footage effortlessly. Advanced stabilization for smooth and professional videos with your phone.',
      price: 129.99,
      imageUrl: '/images/gimbal.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'prod_8',
      name: 'Vintage Leather Wallet',
      description: 'Handcrafted from genuine leather, this wallet combines classic style with practical compartments.',
      price: 49.95,
      imageUrl: '/images/wallet.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};
// --- END MOCK DATA ---


export default async function ProductsPage() {
  // In a real application, fetch products from your database:
  // import prisma from '@/lib/prisma';
  // const products = await prisma.product.findMany();

  // For now, use mock data:
  const products = getMockProducts();

  return (
    <section className="container mx-auto p-6 md:p-8 lg:p-10 flex-grow">
      <h2 className="text-4xl font-extrabold text-[var(--foreground)] text-center mb-10 tracking-tight">
        Our Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-700">No products available yet. Check back soon!</p>
      ) : (
        <ProductGrid>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </section>
  );
}