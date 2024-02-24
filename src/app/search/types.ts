export type OrderSearchParam = 'price_asc' | 'price_desc' | 'rating_desc';

// type SearchParams = 'text' | 'order' | 'price_from' | 'price_to';

export interface SearchParams {
  text?: string;
  order?: OrderSearchParam;
  price_from?: string;
  price_to?: string;
}

export type ProductsT = {
  category: string;
  created_at: string | null;
  description: string;
  id: string;
  img_urls: string[] | null;
  owner: string;
  price: number;
  quantity: number;
  title: string;
  avg_rating: number | null;
  review: {
      rating: number;
  }[] | null;
}[] | null;