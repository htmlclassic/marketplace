'use client';

import dayjs from "dayjs";
import { ReviewType } from ".";
import Rating from "../../../../../components/Rating";

import updateLocale from 'dayjs/plugin/updateLocale';
import { useState } from "react";
import { createClientSupabaseClient } from "@/supabase/utils_client";
import { getAPI } from "@/supabase/api";
import clsx from "clsx";
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля",
    "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ]
})

interface Props {
  review: ReviewType;
}

export default function Review({ review }: Props) {
  return (
    <article className="flex flex-col gap-3 max-w-2xl overflow-hidden [overflow-wrap:anywhere]">
      <header className="flex flex-col gap-5 sm:flex-row sm:justify-between sm:items-center mb-1">
        <div className="flex gap-3 items-center order-1 sm:order-none">
          <div className="shrink-0 w-12 h-12 rounded-full text-2xl bg-gray-700 text-white flex items-center justify-center">
            {review.authorName.at(0)}
          </div>
          <div className="font-bold w-max">{review.authorName}</div>
        </div>
        <div className="flex gap-3 items-center">
          <div>{dayjs(review.created_at).format('DD MMMM YYYY')}</div>
          <Rating value={review.rating} readonly />
        </div>
      </header>
      <div className="flex flex-col gap-1">
        <div className="font-bold">Достоинства</div>
        <div>{review.pros}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold">Недостатки</div>
        <div>{review.cons}</div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-bold">Комментарий</div>
        <div>{review.comment}</div>
      </div>
      <div className="flex gap-3 items-center mt-3">
        <div className="text-sm text-gray-500">Вам помог этот отзыв?</div>
        <Button
          meta={review.likes}
          type="review_like"
          reviewId={review.id!}
        />
        <Button
          meta={review.dislikes}
          type="review_dislike"
          reviewId={review.id!}
        />
      </div>
    </article>
  );
}

interface LikesProps {
  meta: {
    count: number;
    interacted: boolean;
  };
  reviewId: number;
  type: 'review_like' | 'review_dislike';
}

function Button({ meta, reviewId, type }: LikesProps) {
  const [count, setCount] = useState(meta.count);
  const [interacted, setInteracted] = useState(meta.interacted);

  const handleClick = async () => {
    if (interacted) {
      setCount(count - 1);
      setInteracted(c => !c)
      remove(type, reviewId);
    } else {
      setCount(count + 1);
      setInteracted(c => !c)
      add(type, reviewId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx({
        "transition-all hover:bg-gray-300 rounded-full py-1 px-2 text-sm": true,
        "bg-gray-200": !interacted,
        "bg-gray-300": interacted
      })}
    >
      {type === 'review_like' ? 'Да' : 'Нет'} {count}
    </button>
  );
}

async function add(tableName: 'review_like' | 'review_dislike', reviewId: number) {
  const supabase = createClientSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Who is it?');

  const { data } = await supabase
    .from(tableName)
    .select()
    .match({ user_id: uid, review_id: reviewId })
    .limit(1)

  if (data && data.length) throw new Error('User already liked/disliked this review');

  await supabase
    .from(tableName)
    .insert({ user_id: uid, review_id: reviewId });
}

async function remove(tableName: 'review_like' | 'review_dislike', reviewId: number) {
  const supabase = createClientSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  if (!uid) throw new Error('Who is it?');

  await supabase
    .from(tableName)
    .delete()
    .eq('user_id', uid);
}