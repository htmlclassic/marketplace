import type { Metadata } from 'next'
import './global.css'

import { createServerComponentSupabaseClient } from '../../supabase/utils_server';
import { getAPI } from '../../supabase/api';

import { Inter } from 'next/font/google';
 
import ClientWrapper from './ClientWrapper';
import Navbar from '../components/Navbar';

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
      <body className="flex flex-col gap-8 pb-8 min-h-screen max-w-[1920px] mx-auto bg-gray-100">
        <ClientWrapper cartItemsCount={itemsCount}>
          <Navbar  session={!!session} />
          <main className="grow flex px-6">
            {children}
          </main>
        </ClientWrapper>
      </body>
    </html>
  )
}