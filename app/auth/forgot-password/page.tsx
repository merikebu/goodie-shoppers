// app/auth/forgot-password/page.tsx
'use client'; // <-- THIS IS THE CRITICAL FIX

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // The API route for this needs to be inside /api, for example: /api/auth/forgot-password
      // Let's assume you have a file at app/api/auth/forgot-password/route.ts
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message); // This will be a generic success message
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900">Forgot Password</h2>
          <p className="mt-4 text-center text-gray-600">Enter your email to receive a password reset link.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && <p className="text-green-600 bg-green-100 p-3 rounded-md text-center">{message}</p>}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
        <p className="text-center text-sm">
          <Link href="/auth/login" className="font-medium text-[var(--primary-color)] hover:underline">
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}