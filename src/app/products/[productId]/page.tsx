import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import Product from './components/Product';
import Reviews from './components/Reviews';
import { Suspense } from 'react';
import { getProduct } from './utils';

interface PageProps {
  params: {
    productId: string;
  }
}

export default async function ProductPage({ params: { productId } }: PageProps) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();

  const product = await getProduct(productId);

  if (!product) return (
    <div className="grow flex">
      <p>Такого товара не существует.</p>
    </div>
  );

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
      />
    </div>
  );
}