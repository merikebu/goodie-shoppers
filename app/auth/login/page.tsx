// app/auth/login/page.tsx
'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (status === 'authenticated') {
      router.push('/'); // Redirect to the homepage
    }
  }, [status, router]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push(result.url || '/');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 text-[var(--foreground)]">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
        <div>
          <h2 className="mt-6 text-center text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Sign in to <span className="text-[var(--primary-color)]">Goodie</span>
          </h2>
          <p className="mt-4 text-center text-md sm:text-lg text-gray-600">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleCredentialsSignIn}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-[var(--primary-color)] hover:text-indigo-500 transition-colors duration-200">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-3 px-6 text-lg font-medium rounded-md
                       text-white bg-[var(--primary-color)] hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]
                       transition duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          type="button"
          className="group relative w-full flex justify-center items-center py-2.5 px-4
                     border border-gray-300 rounded-lg shadow-sm text-gray-700
                     bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-[var(--primary-color)]
                     transition-all duration-200 text-base font-medium
                     sm:py-3 sm:px-6 sm:text-lg"
          disabled={loading} // Disable if a form submission is ongoing
        >
          {/* Google "G" icon SVG */}
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 mr-3 -ml-1 text-google-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.24 10.236v3.295h6.299c-.273 1.637-1.173 3.036-2.43 3.96v.078h4.093c2.4-2.22 3.79-5.594 3.79-9.52C23.974 4.195 18.067 0 12.016 0 5.405 0 0 5.275 0 11.758s5.405 11.758 12.016 11.758c3.27 0 6.096-1.127 8.358-3.057l-4.093-3.184c-.663.486-1.554.808-2.617.808-3.09 0-5.614-2.317-5.614-5.187s2.524-5.187 5.614-5.187c1.47 0 2.7.534 3.704 1.5l3.242-3.125C19.387 1.94 15.867.042 12.016.042z" />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-[var(--primary-color)] hover:text-indigo-500 transition-colors duration-200">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}