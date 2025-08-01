// app/admin/products/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import Button from '@/components/ui/Button';
import { Pencil } from 'lucide-react';

// We created this component to handle client-side deletion logic
import DeleteProductButton from './DeleteProductButton';

export default async function AdminProductsPage() {
  // Fetch all products directly on the server
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto p-6 sm:p-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Products <span className="text-lg text-gray-500 font-normal">({products.length})</span>
        </h1>
        <Link href="/admin/products/new" passHref>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            + Add New Product
          </Button>
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-600">Image</th>
              <th className="p-3 font-semibold text-gray-600">Name</th>
              <th className="p-3 font-semibold text-gray-600">Price</th>
              <th className="p-3 font-semibold text-gray-600">Created At</th>
              <th className="p-3 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-500">
                  You haven't added any products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <div className="relative h-16 w-16">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="100px" // Provide a reasonable size for the browser to optimize for
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-gray-800 align-middle">
                    {product.name}
                  </td>
                  <td className="p-3 text-gray-600 align-middle">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-500 text-sm align-middle">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`} passHref>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-100 border-blue-600"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      
                      {/* Interactive Delete button is a separate Client Component */}
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}