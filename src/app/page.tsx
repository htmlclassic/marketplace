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
      <div className="top-margin side-padding grid gap-3 sm:gap-5 content-start grid-cols-2 justify-center min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 w-full">
        {itemsList}
      </div>
    </>
  );
}