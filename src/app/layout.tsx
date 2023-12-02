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
  const api = getAPI(createServerComponentSupabaseClient());
  const session = await api.getSession();
  const cartItems = await api.getCartItems();
  const itemsCount = cartItems?.length || 0;

  return (
    <html className={inter.className} lang='ru'>
      <body className="flex flex-col gap-2 pb-20 sm:gap-6 sm:pb-6 min-h-screen max-w-[1920px] mx-auto">
        <ClientWrapper cartItemsCount={itemsCount}>
          <Navbar  session={!!session} />
          <MobileHeader />
          <MobileMenu />
          <main className="grow flex px-2 sm:px-6">
            {children}
          </main>
        </ClientWrapper>
      </body>
    </html>
  )
}