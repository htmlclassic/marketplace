import { createServerComponentSupabaseClient } from "@/supabase/utils_server";

export async function getSellerStatistics() {
  const supabase = createServerComponentSupabaseClient();

  const { data: soldItems } = await supabase
    .from('order_items')
    .select(`
      quantity,
      price,
      product_id
    `);

  if (!soldItems?.length) return null;

  const { data: products } = await supabase
    .from('product')
    .select(`
      id,
      title,
      price,
      quantity
    `)
    .in('id', soldItems.map(item => item.product_id));

  if (!products?.length) return null;

  interface I {
    product: {
      id: string,
      title: string,
      currentPrice: number,
      quantity: number
    },
    soldCount: number,
    total: number
  }

  let stats: I[] = [];

  for (const product of products) {
    const items = soldItems.filter(item => item.product_id === product.id);
    const soldCount = items.length;
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    stats.push({
      product: {
        id: product.id,
        title: product.title,
        currentPrice: product.price,
        quantity: product.quantity
      },
      soldCount,
      total
    });
  }

  return stats.length ? stats : null;
}