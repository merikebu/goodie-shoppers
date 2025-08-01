// components/ProductGrid.tsx
import React from 'react';

interface ProductGridProps {
  children: React.ReactNode;
}

const ProductGrid: React.FC<ProductGridProps> = ({ children }) => {
  return (
    // Responsive grid classes using Tailwind
    // gap: spacing between items
    // sm: grid-cols-2 for small screens
    // lg: grid-cols-3 for large screens
    // xl: grid-cols-4 for extra-large screens
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {children}
    </div>
  );
};

export default ProductGrid;