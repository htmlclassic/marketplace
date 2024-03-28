export type OrderSearchParam = 'price_asc' | 'price_desc' | 'rating_desc';

export interface SearchParams {
  text?: string;
  order?: OrderSearchParam;
  price_from?: string;
  price_to?: string;
  category?: string;
}

export type { Categories } from './utils';
export type { ProductsWithAvgRating } from './utils';