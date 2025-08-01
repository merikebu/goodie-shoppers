// app/auth/login/page.tsx
'use client'

import { signIn, useSession, getSession } from 'next-auth/react' // <-- Add getSession
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
    // This part is for users who are ALREADY logged in and land on this page.
    if (status === 'authenticated') {
      if ((session.user as any).role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [status, session, router]);
  
  const handleSignIn = async (provider: 'credentials' | 'google') => {
    setLoading(true);
    setError('');

    const signInData = provider === 'credentials'
      ? { redirect: false, email, password }
      : { redirect: false, callbackUrl: '/' };

    const result = await signIn(provider, signInData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return; // Stop execution on error
    }

    // After a successful signIn, we must re-fetch the session to get the updated token with the role
    const updatedSession = await getSession();
    
    console.log('[Login Page] Sign-in successful, checking updated session:', updatedSession);

    if (updatedSession?.user && (updatedSession.user as any).role === 'ADMIN') {
      console.log('[Login Page] Role is ADMIN, redirecting to dashboard.');
      router.push('/admin/dashboard');
    } else {
      console.log('[Login Page] Role is not admin, redirecting to homepage.');
      router.push('/');
    }

    // It's good practice to not set loading to false here,
    // as the page will be unmounted during the redirect.
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn('credentials');
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  // Render null or the form, but not both if authenticated. useEffect handles redirect.
  if (status === 'authenticated') return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            Sign in to <span className="text-[var(--primary-color)]">Goodie</span>
          </h2>
        </div>
        
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email and Password Inputs */}
          <div>
            <Input id="email" name="email" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Input id="password" name="password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center justify-end text-sm">
            <Link href="/auth/forgot-password" className="font-medium text-[var(--primary-color)] hover:underline">
              Forgot your password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or continue with</span></div></div>

        {/* Google Button */}
        <button
          onClick={() => handleSignIn('google')}
          type="button"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition"
        >
          {/* SVG for Google Icon */}
          <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.236v3.295h6.299c-.273 1.637-1.173 3.036-2.43 3.96v.078h4.093c2.4-2.22 3.79-5.594 3.79-9.52C23.974 4.195 18.067 0 12.016 0 5.405 0 0 5.275 0 11.758s5.405 11.758 12.016 11.758c3.27 0 6.096-1.127 8.358-3.057l-4.093-3.184c-.663.486-1.554.808-2.617.808-3.09 0-5.614-2.317-5.614-5.187s2.524-5.187 5.614-5.187c1.47 0 2.7.534 3.704 1.5l3.242-3.125C19.387 1.94 15.867.042 12.016.042z" /></svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600">Don't have an account? <Link href="/auth/register" className="font-medium text-[var(--primary-color)] hover:underline">Register now</Link></p>
      </div>
    </div>
  );
}