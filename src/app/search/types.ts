export type OrderSearchParam = 'price_asc' | 'price_desc' | 'rating_desc';

// type SearchParams = 'text' | 'order' | 'price_from' | 'price_to';

export interface SearchParams {
  text?: string;
  order?: OrderSearchParam;
  price_from?: string;
  price_to?: string;
}

export type ProductsWithRating = (Product & {
  review: {
      rating: number;
  }[];
})[] | null;