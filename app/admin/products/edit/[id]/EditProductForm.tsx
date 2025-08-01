// app/admin/products/edit/[id]/EditProductForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Product } from '@prisma/client'; // Import Product type from Prisma

interface EditProductFormProps {
  product: Product;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Product updated successfully! Redirecting...');
        setTimeout(() => router.push('/admin/products'), 2000);
        router.refresh(); // Important: Tell Next.js to refetch server data on the admin products page
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update product.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-3 rounded">{success}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Change Image (optional)
          </label>
          <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          {product.imageUrl && (
            <div className="mt-2 text-sm text-gray-500">
              Current image: <a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a>
            </div>
          )}
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Product'}
        </Button>
      </form>
    </div>
  );
}