import type { Metadata } from 'next'
import './global.css'

import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import { getAPI } from '../../supabase/api';

import { Inter } from 'next/font/google';
 
import ClientWrapper from './ClientWrapper';
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu/MobileMenu';
import MobileHeader from '../components/MobileHeader/MobileHeader';

export const metadata: Metadata = {
  title: 'Marketplace',
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = createServerComponentSupabaseClient();
  const api = getAPI(supabase);
  const uid = await api.getCurrentUserId();
  const cartItems = await api.getCartItems();

  // get initial cart state
  let initialCart: CartItem[] = [];

  if (cartItems) {
    const productIds = cartItems.map(item => item.product_id);

    const { data } = await supabase
      .from('product')
      .select('quantity, id, price')
      .in('id', productIds);

    if (data) {
      initialCart = cartItems.map(item => {
        const product = data.find(el => el.id === item.product_id)!;
        const quantity = product.quantity < item.quantity ? product.quantity : item.quantity;

        // set new quantity in db
        if (product.quantity < item.quantity) {
          api.setCartItemQuantity(product.id, product.quantity);
        }
        
        return {
          quantity,
          maxQuantity: product.quantity,
          product_id: item.product_id,
          price: product.price
        };
      });
    }
  }

  return (
    <html className={inter.className} lang='ru'>
      <body className="flex flex-col gap-2 pb-20 sm:gap-6 sm:pb-6 min-h-screen max-w-[1920px] mx-auto">
        <ClientWrapper initialCart={initialCart} uid={uid}>
          <Navbar />
          <MobileHeader />
          <main className="grow flex">
            {children}
          </main>
          <MobileMenu />
        </ClientWrapper>
      </body>
    </html>
  )
}