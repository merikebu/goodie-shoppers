// app/auth/register/page.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      // --------------------------------------------------------------------------
      // UPDATED FETCH URL: It now targets /auth/register/api
      // --------------------------------------------------------------------------
      const response = await fetch('/auth/register/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        console.log('Registration success:', data);
        setTimeout(() => {
          router.push('/auth/login'); // Redirect to login after successful registration
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        console.error('Registration failed:', data);
      }
    } catch (err) {
      console.error('Network or unexpected error during registration:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
        <div>
          <h2 className="mt-6 text-center text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Register for Goodie
          </h2>
          <p className="mt-4 text-center text-md sm:text-lg text-gray-600">
            Create your account to start shopping!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-600 text-sm font-medium text-center bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium text-center bg-green-100 p-2 rounded">
              {success}
            </p>
          )}

          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
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
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-3 px-6 text-lg font-medium rounded-md
                       text-white bg-[var(--primary-color)] hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]
                       transition duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-[var(--primary-color)] hover:text-indigo-500 transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}