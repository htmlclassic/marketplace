'use client';

import Input from "./Input";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  quantity: number;
  maxQuantity: number;
  setItemQuantity: (newQuantity: number) => void;
  removeCartItem: () => void;
}

export default function CartItemControls({
  quantity,
  maxQuantity,
  setItemQuantity,
  removeCartItem
}: Props) {
  const handleDecreaseItemQuantity = () => {
    if (quantity >= 2) {
      setItemQuantity(quantity - 1);
    }
  };

  const handleIncreaseItemQuantity = () => {
    if (quantity < maxQuantity) {
      setItemQuantity(quantity + 1);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex items-center bg-gray-100 py-1 rounded-xl overflow-hidden">
        <button
          onClick={handleDecreaseItemQuantity}
          disabled={quantity === 1}
          title="Уменьшить количество"
          className="disabled:text-gray-300 text-2xl select-none px-4 transition-all duration-300"
        >-</button>
        <Input
          quantity={quantity}
          maxQuantity={maxQuantity}
          setItemQuantity={setItemQuantity}
        />
        <button
          onClick={handleIncreaseItemQuantity}
          disabled={quantity === maxQuantity}
          title="Увеличить количество"
          className="disabled:text-gray-300 text-2xl select-none px-4 transition-all duration-300"
        >+</button>
      </div>
      <button
        onClick={removeCartItem}
        className="p-3 text-gray-500 transition-all duration-300 hover:text-black"
        title="Удалить из корзины"
      >
        {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 6.72998C20.98 6.72998 20.95 6.72998 20.92 6.72998C15.63 6.19998 10.35 5.99998 5.12001 6.52998L3.08001 6.72998C2.66001 6.76998 2.29001 6.46998 2.25001 6.04998C2.21001 5.62998 2.51001 5.26998 2.92001 5.22998L4.96001 5.02998C10.28 4.48998 15.67 4.69998 21.07 5.22998C21.48 5.26998 21.78 5.63998 21.74 6.04998C21.71 6.43998 21.38 6.72998 21 6.72998Z" fill="currentColor"/>
          <path d="M8.50001 5.72C8.46001 5.72 8.42001 5.72 8.37001 5.71C7.97001 5.64 7.69001 5.25 7.76001 4.85L7.98001 3.54C8.14001 2.58 8.36001 1.25 10.69 1.25H13.31C15.65 1.25 15.87 2.63 16.02 3.55L16.24 4.85C16.31 5.26 16.03 5.65 15.63 5.71C15.22 5.78 14.83 5.5 14.77 5.1L14.55 3.8C14.41 2.93 14.38 2.76 13.32 2.76H10.7C9.64001 2.76 9.62001 2.9 9.47001 3.79L9.24001 5.09C9.18001 5.46 8.86001 5.72 8.50001 5.72Z" fill="currentColor"/>
          <path d="M15.21 22.75H8.78999C5.29999 22.75 5.15999 20.82 5.04999 19.26L4.39999 9.18995C4.36999 8.77995 4.68999 8.41995 5.09999 8.38995C5.51999 8.36995 5.86999 8.67995 5.89999 9.08995L6.54999 19.16C6.65999 20.68 6.69999 21.25 8.78999 21.25H15.21C17.31 21.25 17.35 20.68 17.45 19.16L18.1 9.08995C18.13 8.67995 18.49 8.36995 18.9 8.38995C19.31 8.41995 19.63 8.76995 19.6 9.18995L18.95 19.26C18.84 20.82 18.7 22.75 15.21 22.75Z" fill="currentColor"/>
        </svg> */}
        <DeleteIcon />
      </button>
    </div>
  );
}