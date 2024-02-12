'use client';

// probably I should move datapicker providers to individual routes?
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/ru';
import CartContextProvider from '../CartContext';

interface Props {
  children: React.ReactNode;
  initialCart: CartItem[];
  uid: string | null;
}

export default function ClientWrapper({ children, initialCart, uid }: Props) {
  return (
      <CartContextProvider initialCart={initialCart} uid={uid}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="ru"
          localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          {children}
        </LocalizationProvider>
      </CartContextProvider>
  );
}