'use client';

import { useState } from "react";
import { ReviewType } from ".";
import Review from "./Review";
import CreateReview from "./CreateReview";
import { motion } from 'framer-motion';

interface Props {
  reviews: ReviewType[];
  productId: string;
  currentUserName: string | null;
  canReview: boolean;
  userLoggedIn: boolean;
}

export default function ReviewList({
  reviews: initialReviews,
  productId,
  currentUserName,
  canReview,
  userLoggedIn
}: Props) {
  // i tried useOptimistic hook but it didnt rerender my component on state change, idk why
  const [reviews, setReviews] = useState(initialReviews);

  const addOptimisticReview = (newReview: ReviewType) => {
    const newState = [
      newReview,
      ...reviews
    ];

    setReviews(newState);
  }
  
  return (
    <motion.div
      className="flex flex-col"
    >
      <h2 className="font-medium text-xl mb-7">Отзывы</h2>
      <div className="flex flex-col gap-5">
        {
          reviews.length
            ?
              reviews.map((review, i) =>
                <Review
                  key={i} 
                  review={review} 
                  userLoggedIn={userLoggedIn} 
                />
              )
            :
              <div>Никто пока что не оценил этот товар.</div>
        }
        {
        canReview &&   
          <CreateReview
            productId={productId}
            addOptimisticReview={addOptimisticReview}
            currentUserName={currentUserName}
          />
        }
      </div>
    </motion.div>
  );
}