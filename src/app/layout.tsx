import type { Metadata } from 'next'
import './global.css'

import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import { getAPI } from '../../supabase/api';

// import { Inter } from 'next/font/google';
import { Roboto } from 'next/font/google';
 
import ClientWrapper from './ClientWrapper';
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu';
import { Toaster } from "@/src/components/ui/sonner";

// import type { Viewport } from 'next'
 
// export const viewport: Viewport = {
//   themeColor: [
//     { color: 'lightblue' },
//   ],
// }

export const metadata: Metadata = {
  title: 'Marketplace',
}

const inter = Roboto({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700']
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
  // p.s. all pages are dynamically rendered. I think to solve this problem
  // you have to fetch cart from server in ClientWrapper by using useEffect
  let initialCart: CartItem[] = [];

  if (cartItems) {
    initialCart = cartItems.map(item => {
      const isProductQuantityLessThanInCart = item.product.quantity < item.quantity;
      const quantity = isProductQuantityLessThanInCart ? item.product.quantity : item.quantity;

      // set new quantity in db
      if (isProductQuantityLessThanInCart) {
        api.setCartItemQuantity(item.product.id, item.product.quantity);
      }
      
      return {
        ...item,
        quantity,
      };
    });
  }

  return (
    <html className={inter.className} lang='ru'>
      <body className="flex flex-col [--mobile-pb:calc(var(--mobile-menu-height)+1rem)] pb-[--mobile-pb] sm:pb-6 min-h-[100svh] max-w-[1920px] mx-auto">
        <ClientWrapper initialCart={initialCart} uid={uid}>
          <Navbar />
          <main className="w-full grow flex max-w-[1400px] mx-auto z-10">
            {children}
          </main>
          <Toaster />
          <MobileMenu />
        </ClientWrapper>
      </body>
    </html>
  )
}
