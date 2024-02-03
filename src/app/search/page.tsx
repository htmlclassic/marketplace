import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import ProductList from './ProductList';

export interface Rating {
  productId: string;
  avgRating: number;
}

export default async function Catalog() {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  // no need to select all the products
  // later implement WHERE in getProducts
  const products = await api.getProducts();
  const rating: Rating[] = await getProductsRating(products!.map(pr => pr.id));

  async function getProductsRating(productIds: string[]) {
    return Promise.all(
      productIds.map(async (productId) => {
        const { data: reviews } = await supabase
          .from('review')
          .select('rating')
          .eq('product_id', productId);

        if (reviews) {
          const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
          
          return {
            productId,
            avgRating
          };
        }

        return {
          productId,
          avgRating: 0
        };
      })
    );
  }

  return (
    <div className="side-padding grid content-start grid-cols-2 justify-center min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-7 w-full">
      <ProductList products={products} rating={rating} />
    </div>
  );
}