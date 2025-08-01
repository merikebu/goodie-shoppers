// app/shop/product/[id]/RatingsSection.tsx
'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Rating, User } from '@prisma/client';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type RatingWithUser = Rating & { user: { name: string | null; image: string | null } };

interface RatingsSectionProps {
  productId: string;
  ratings: RatingWithUser[];
}

export default function RatingsSection({ productId, ratings: initialRatings }: RatingsSectionProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      router.push('/auth/login');
      return;
    }
    setIsLoading(true);
    
    try {
        const response = await fetch('/api/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, value: ratingValue, comment }),
        });
        
        if (response.ok) {
            setFeedback('Thank you for your review!');
            router.refresh(); // Refetch server data to show the new review
        } else {
            setFeedback('You have already rated this product.');
        }

    } catch (error) {
        setFeedback('An error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

      {/* Write a Review Form */}
      {status === 'authenticated' && (
        <form onSubmit={handleRatingSubmit} className="mb-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Write your review</h3>
          <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-700">Your Rating:</span>
              {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRatingValue(star)} className="focus:outline-none">
                      <svg className={`w-6 h-6 ${ratingValue >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.175 0l-3.366 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
                  </button>
              ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Share your thoughts..." className="w-full p-2 border rounded" />
          <Button type="submit" className="mt-4" disabled={isLoading || ratingValue === 0}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
          {feedback && <p className="mt-2 text-sm text-green-600">{feedback}</p>}
        </form>
      )}

      {/* Display Existing Reviews */}
      <div className="space-y-6">
          {initialRatings.length === 0 ? <p>No reviews yet. Be the first!</p> :
              initialRatings.map(rating => (
                  <div key={rating.id} className="p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                           <div className="flex">
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg key={star} className={`w-4 h-4 ${rating.value >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.175 0l-3.366 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.051 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
                            ))}
                          </div>
                          <p className="ml-4 font-semibold">{rating.user.name}</p>
                      </div>
                      <p className="text-gray-600">{rating.comment}</p>
                  </div>
              ))
          }
      </div>
    </div>
  );
}