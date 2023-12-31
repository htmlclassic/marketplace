'use client';

import { useState } from "react";
import { ReviewType } from ".";
import Review from "./Review";
import CreateReview from "./CreateReview";

interface Props {
  reviews: ReviewType[];
  productId: string;
  currentUserName: string | null;
  canReview: boolean;
}

export default function ReviewList({
  reviews: initialReviews,
  productId,
  currentUserName,
  canReview
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
    <div className="flex flex-col gap-5">
      {
        canReview &&   
          <CreateReview
            productId={productId}
            addOptimisticReview={addOptimisticReview}
            currentUserName={currentUserName}
          />
      }
      <div className="flex flex-col gap-10">
        {
          reviews.length
            ?
              reviews.map((review, i) =>
              <Review key={i} review={review} />
              )
            :
            <div>Никто пока что не оценил этот товар.</div>
        }
      </div>
    </div>
  );
}