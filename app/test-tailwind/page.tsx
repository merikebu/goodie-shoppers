// app/test-tailwind/page.tsx
'use client' // Use client component to observe dynamic class changes or hover states

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button'; // Assuming your Button component is responsive

export default function TailwindTestPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center">

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--primary-color)] text-center mb-8 sm:mb-10 lg:mb-12">
        Tailwind CSS Test Page
      </h1>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Basic Styling & Layout
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md flex flex-col justify-between items-center text-center hover:bg-blue-200 transition-colors duration-200">
            <p className="text-blue-700 text-lg sm:text-xl font-semibold mb-3">
              This is a responsive box!
            </p>
            <p className="text-blue-500 text-sm">
              Watch padding change on small (sm:p-6), background on hover.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-green-100 p-4 sm:p-6 rounded-lg shadow-md flex flex-col justify-between items-center text-center hover:bg-green-200 transition-colors duration-200">
            <p className="text-green-700 text-lg sm:text-xl font-semibold mb-3">
              Colors from `globals.css` vars:
            </p>
            <p className="text-[var(--primary-color)] font-medium text-sm">
              Primary color text example
            </p>
            <p className="text-[var(--foreground)] text-xs">
              Foreground color text example
            </p>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 mt-8">
          Interactive Elements
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 duration-200 shadow-lg w-full sm:w-auto">
            Interactive Button
          </Button>
          <Button className="bg-[var(--secondary-color)] hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 duration-200 shadow-lg w-full sm:w-auto">
            Custom Variable Button
          </Button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 mt-8">
          Image & Dark Mode Test
        </h2>
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Image */}
          <Image
            src="/images/smartwatch.jpg" // Ensure this image exists in public/images
            alt="Sample Product Image"
            width={200}
            height={200}
            className="rounded-xl shadow-lg border-2 border-gray-300 dark:border-gray-700"
          />
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Image with responsive sizing.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
            The background (`var(--background)`) and text (`var(--foreground)`) for the overall page, as well as the border on this image, should change when you switch your system to Dark Mode.
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 mt-8">
          Text & Typography
        </h2>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          This paragraph uses <span className="font-bold">bold text</span> and a normal font size. It also demonstrates responsive `leading` (line-height).
        </p>
        <p className="text-lg text-gray-900 font-medium">
          Larger text for emphasis. Font weights (`font-medium`) are active.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="text-lg text-[var(--primary-color)] hover:underline">
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
}