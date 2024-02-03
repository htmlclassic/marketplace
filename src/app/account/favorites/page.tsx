import ManageFavoriteButton from "@/src/components/ManageFavoriteButton";
import ProductPreview from "@/src/components/ProductPreview";
import { getAPI } from "@/supabase/api";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export default async function Page() {
  const api = getAPI(createServerComponentSupabaseClient());
  const favorites = await api.getFavoriteProductIds();
  
  if (!favorites) {
    return (
      <div>У вас нет избранных товаров.</div>
    );
  }

  const products = await api.getProducts(favorites.map(item => item.product_id));

  return (
    <div>
      <h1 className="text-lg mb-10 font-semibold">Избранные товары</h1>
      <div
        className="w-full grid gap-3 sm:gap-5 content-start grid-cols-2 justify-center min-[560px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
      >
        {
          products?.map(product =>
            <div
              className="relative"
              key={product.id}
            >
              <div className="absolute right-0 top-0 z-10">
                <ManageFavoriteButton
                  productId={product.id}
                  isFavorite={true}
                  hideText
                />
              </div>
              <ProductPreview product={product} />
            </div>
          )
        }
      </div>
    </div>
  );
}