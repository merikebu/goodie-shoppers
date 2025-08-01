// app/admin/products/DeleteProductButton.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    // A simple confirmation dialog before deleting
    if (!confirm(`Are you sure you want to delete the product "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        router.refresh(); // This tells Next.js to refetch the data on the current page
      } else {
        const data = await response.json();
        alert(`Failed to delete product: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred. Please check the console.');
      console.error('Delete error:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="text-red-600 hover:bg-red-100 border-red-600"
      aria-label={`Delete ${productName}`}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}