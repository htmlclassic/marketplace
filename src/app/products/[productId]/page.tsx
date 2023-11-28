import { getAPI } from '@/supabase/api';
import { createServerComponentSupabaseClient } from '@/supabase/utils_server';
import Product from './components/Product';
import Reviews from './components/Reviews';
import ManageCartItemButton from './components/ManageCartItemButton';
import Link from 'next/link';

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
  
  const { data: sellerName } = await supabase.rpc('get_user_name', { userid: product.owner});
  const outOfStock = product.quantity <= 0;

  let cartControl: React.ReactNode;

  if (outOfStock) {
    cartControl = <p className="text-red-400 text-lg font-bold">Товар закончился.</p>;
  } else if (uid && uid !== product.owner) {
    cartControl = <ManageCartItemButton productId={product.id} />;
  } else if (uid === product.owner) {
    cartControl = <p className="text-red-400 font-bold underline underline-offset-2">Вы являетесь владельцем этого товара.</p>;
  } else {
    cartControl =
        <Link
          href="/login"
          className="border border-black p-3 w-max"
        >Авторизоваться</Link>
  }

  return (
    <div className="grow space-y-5">
      <Product
        product={product}
        sellerName={sellerName!}
        uid={uid}
      >
        {cartControl}
      </Product>
      <Reviews productId={productId} />
    </div>
  );
}