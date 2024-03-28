import { getProduct } from './utils';

export type Product = Awaited<ReturnType<typeof getProduct>>;