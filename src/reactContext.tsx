import { Dispatch, SetStateAction, createContext, useState } from "react";

interface IContext {
  cartItemsCount: number;
  setCartItemsCount: Dispatch<SetStateAction<number>>;
}

export const CartContext = createContext({} as IContext);

interface Props {
  children: React.ReactNode;
  value: number;
}

export function CartContextProvider({ children, value: initValue }: Props) {
  const [cartItemsCount, setCartItemsCount] = useState(initValue);

  return (
    <CartContext.Provider value={{ cartItemsCount, setCartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
}