import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import ReviewList from "./ReviewList";

interface Likes {
  count: number;
  interacted: boolean;
}

export type ReviewType =
  Omit<Review,
    'author_id' |
    'id' |
    'product_id' |
    'updated_at'
  >
  & {
    authorName: string;
    likes: Likes;
    dislikes: Likes;
    id?: number;
  };

export default async function Index({ productId }: { productId: string; }) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();
  const currentUserName = await api.getUserName(uid);
  
  const { data: product } = await supabase
    .from('order_items')
    .select('order(user_id)')
    .eq('product_id', productId)
    .limit(1)
    .single();

  const userBoughtProduct = Boolean(product?.order?.user_id);

  let { data } = await supabase
    .from('review')
    .select('*, review_like(*), review_dislike(*)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  data = data?.length ? data : [];

  const userReview = data.find(review => review.author_id === uid);
  const filteredData = data.filter(review => review.author_id !== uid);
  let sortedReviews = filteredData;

  if (userReview) {
    sortedReviews = [
      userReview,
      ...sortedReviews
    ];
  }

  const authors = await Promise.all(
    sortedReviews.map(review =>
      api.getUserName(review.author_id)
    )
  ) as string[];

  const meta = await Promise.all(sortedReviews.map(async (review) => {
    const { data: likes } = await supabase
      .from('review_like')
      .select('id')
      .match({ user_id: uid, review_id: review.id })
      .limit(1);

    const { data: dislikes } = await supabase
      .from('review_dislike')
      .select('id')
      .match({ user_id: uid, review_id: review.id })
      .limit(1);

    return {
      likes: {
        count: review.review_like.length,
        interacted: Boolean(likes?.length)
      },
      dislikes: {
        count: review.review_dislike.length,
        interacted: Boolean(dislikes?.length)
      }
    };
  }));

  const reviews: ReviewType[] = sortedReviews.map((review, index) => ({
    comment: review.comment,
    cons: review.cons,
    pros: review.pros,
    rating: review.rating,
    created_at: review.created_at,
    dislikes: meta[index].dislikes,
    likes: meta[index].likes,
    authorName: authors[index],
    id: review.id
  }));

  const canReview = userBoughtProduct && !userReview;

  return (
    <ReviewList
      reviews={reviews}
      productId={productId}
      currentUserName={currentUserName}
      canReview={canReview}
      userLoggedIn={!!uid}
    />
  );
}