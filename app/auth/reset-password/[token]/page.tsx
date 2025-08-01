// app/auth/reset-password/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/auth/reset-password/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => router.push('/auth/login'), 3000); // Redirect after success
      } else {
        setError(data.message || 'Failed to reset password.');
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
          <h2 className="text-center text-4xl font-extrabold text-gray-900">Reset Your Password</h2>
          <p className="mt-4 text-center text-gray-600">Enter and confirm your new password.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {message && <p className="text-green-600 bg-green-100 p-3 rounded-md text-center">{message}</p>}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

          <div>
            <label htmlFor="password-reset" className="sr-only">New Password</label>
            <Input
              id="password-reset"
              name="password"
              type="password"
              required
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-password-reset" className="sr-only">Confirm New Password</label>
            <Input
              id="confirm-password-reset"
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
         {message && (
          <p className="text-center text-sm mt-4">
            <Link href="/auth/login" className="font-medium text-[var(--primary-color)] hover:underline">
              Proceed to Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}