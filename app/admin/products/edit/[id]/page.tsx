// app/admin/products/edit/[id]/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm'; // <-- IMPORT the form component

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Pass the product data to our Client Component form
  return <EditProductForm product={product} />;
}