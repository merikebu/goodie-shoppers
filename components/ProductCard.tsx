// components/ProductCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For optimized images
import Button from './ui/Button';
import { Product } from '@/types'; // Import the Product interface

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-all duration-300 border border-gray-200">
      <Link href={`/shop/product/${product.id}`} className="block relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100 group">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill // Use fill to make image cover parent, and apply object-cover
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 text-lg">
            No Image
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || 'No description available.'}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-extrabold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <Link href={`/shop/product/${product.id}`} passHref>
            <Button className="bg-[var(--primary-color)] hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm md:text-base shadow-md">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;