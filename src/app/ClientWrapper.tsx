'use client';

// probably I should move datapicker providers to individual routes?
import { LocalizationProvider } from '@mui/x-date-pickers';
import { ruRU } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CartContextProvider } from '../reactContext';

import 'dayjs/locale/ru';

interface Props {
  children: React.ReactNode;
  cartItemsCount: number;
}

export default function ClientWrapper({ children, cartItemsCount }: Props) {
  return (
    <CartContextProvider value={cartItemsCount}>
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