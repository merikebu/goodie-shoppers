 
// app/admin/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto p-6 sm:p-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome, <span className="font-semibold text-[var(--primary-color)]">{session?.user?.name || session?.user?.email}</span>!
        </p>
        <p className="text-gray-500 mt-2">
          You have successfully accessed the protected admin area. From here, you will be able to manage products, users, and orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Manage Products</h2>
          <p className="text-gray-500 mt-2">
            Create, update, view, and delete products from the store.
          </p>
          <Link href="/admin/products/new" className="text-indigo-600 hover:underline mt-4 inline-block font-medium">
            Go to Products →
          </Link>
        </div>

        {/* Placeholder for User Management */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">Manage Users</h2>
          <p className="text-gray-500 mt-2">
            View user accounts and manage their roles.
          </p>
          <p className="text-indigo-400 mt-4 inline-block font-medium cursor-not-allowed">
            Coming Soon →
          </p>
        </div>

        {/* Placeholder for Order Management */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700">View Orders</h2>
          <p className="text-gray-500 mt-2">
            Browse and manage all customer orders.
          </p>
          <p className="text-indigo-400 mt-4 inline-block font-medium cursor-not-allowed">
            Coming Soon →
          </p>
        </div>
        <Link href="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="text-xl font-semibold">Manage Products</h2>
  <p className="text-gray-600 mt-2">Add, edit, and delete products.</p>
</Link>
      </div>
    </div>
  );
}