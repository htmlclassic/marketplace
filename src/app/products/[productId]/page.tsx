import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import Product from './components/Product';
import Reviews from './components/Reviews';
import { Suspense } from 'react';

interface ItemProps {
  params: {
    productId: string;
  }
}

export default async function ProductPage({ params: { productId } }: ItemProps) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const product = ( await api.getProducts([productId]) )?.[0];
  const uid = await api.getCurrentUserId();

  if (!product) return (
    <div className="grow flex">
      <p>Такого товара не существует.</p>
    </div>
  );
  
  const isFavorite = await api.isProductFavorite(product.id);
  const { data: sellerName } = await supabase.rpc('get_user_name', { userid: product.owner});

  return (
    <div className="top-margin overflow-x-hidden w-full">
      <Product
        product={product}
        sellerName={sellerName!}
        uid={uid}
        Reviews={
          <Suspense fallback="Загрузка отзывов...">
            <Reviews productId={product.id} />
          </Suspense>
        }
        isFavorite={isFavorite}
      />
    </div>
  );
}