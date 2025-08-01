// app/account/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Button from '@/components/ui/Button' // Assuming you have a reusable Button component
import Input from '@/components/ui/Input'   // Assuming you have a reusable Input component
import Link from 'next/link'

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated once loading is complete
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 text-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-xl text-gray-700">Loading user profile...</p>
      </div>
    )
  }

  // If status is authenticated, session will not be null
  if (session) {
    const user = session.user

    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg space-y-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
              My Profile
            </h1>
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-indigo-500 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl font-bold text-gray-600 mb-6 border-4 border-gray-400">
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
            )}
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={user?.name || ''}
                disabled // Disabled as this is a read-only display for now
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user?.email || ''}
                disabled // Disabled for read-only
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <Input
                id="userId"
                name="userId"
                type="text"
                value={user?.id || 'N/A'}
                disabled // Disabled for read-only
                className="bg-gray-50 cursor-not-allowed text-xs"
              />
            </div>
            {/* You could add buttons for 'Edit Profile' or 'Change Password' here */}
            <div className="flex justify-center mt-8">
              <Link href="/account/orders">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200">
                  View My Orders
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // This should theoretically not be reached if unauthenticated state causes a redirect
  return null
}