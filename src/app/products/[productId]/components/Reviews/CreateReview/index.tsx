'use client';

import { createReview } from "./createReview";
import { useEffect, useState } from "react";
import Rating from "../../../../../../components/Rating";
import { ReviewType } from "..";

interface Props {
  addOptimisticReview: (newReview: ReviewType) => void;
  productId: string;
  currentUserName: string | null;
}

export default function CreateReviewForm({
  productId,
  addOptimisticReview,
  currentUserName,
}: Props) {
  const [show, setShow] = useState(false);
  const [reviewAdded, setReviewAdded] = useState(false);

  async function formAction(formData: FormData) {
    const pros = String(formData.get('pros'));
    const cons = String(formData.get('cons'));
    const comment = String(formData.get('comment'));
    const rating = Number(formData.get('rating'));

    const newReview: ReviewType = {
      pros,
      cons,
      comment,
      rating,
      likes: {
        interacted: false,
        count: 0
      },
      dislikes: {
        interacted: false,
        count: 0
      },
      created_at: new Date().toISOString(),
      authorName: currentUserName!
    };

    addOptimisticReview(newReview);
    setShow(false);
    setReviewAdded(true);

    createReview(productId, formData);
  }

  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => { document.body.style.overflow = ''; };
  }, [show])

  if (!currentUserName) return null;

  if (reviewAdded) return null;

  if (!show) {
    return (
      <div
        className="bg-green-300 py-3 px-6 w-max rounded-lg cursor-pointer transition-colors hover:bg-green-400"
        onClick={() => setShow(true)}
      >
        Написать отзыв
      </div>
    );
  }

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-white flex flex-col justify-center items-center z-[5] p-3">
      <button
        onClick={() => setShow(false)}
        className="absolute right-[20px] top-[100px] border py-2 px-4 cursor-pointer transition-all hover:border-black"
      >X</button>

      <h1 className="font-bold text-2xl mb-10">Отзыв о товаре</h1>
      <form 
        action={formAction}
        className="relative max-w-xl w-full flex flex-col gap-3"
      >
        <label className="flex flex-col gap-3">
          <div>Достоинства:</div>
          <textarea className="border" name="pros"></textarea>
        </label>
        <label className="flex flex-col gap-3">
          <div>Недостатки:</div>
          <textarea className="border" name="cons"></textarea>
        </label>
        <label className="flex flex-col gap-3">
          <div>Комментарий:</div>
          <textarea className="border" name="comment"></textarea>
        </label>
        <div className="flex flex-col gap-3">
          <div>Оцените товар по 5-бальной шкале</div>
          <Rating value={2} />
        </div>
        <input type="submit" value="Отправить отзыв" className="border-2 p-3 cursor-pointer mt-5" />
      </form>
     </div> 
  );
}