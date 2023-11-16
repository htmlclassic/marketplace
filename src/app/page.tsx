import { getAPI } from '../../supabase/api';
import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import ProductPreview from '../components/ProductPreview';

export default async function Catalog() {
  const api = getAPI(createServerComponentSupabaseClient());
  const products = await api.getProducts();
  let itemsList: React.ReactNode = <p>No items on sale yet.</p>;

  if (products) {
    const productsInStock = products.filter(pr => pr.quantity > 0);

    itemsList = productsInStock.map(product =>
      <ProductPreview key={product.id} product={product} />
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(1,minmax(0,270px))] justify-center min-[560px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-7 x w-full">
        {itemsList}
      </div>
    </>
  );
}