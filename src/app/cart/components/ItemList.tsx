'use client';

import { Dispatch, SetStateAction, useState } from "react";
import Item from "./Item";
import { CartState } from "../page";

interface Props {
  products: Product[];
  cart: CartState[];
  itemsQuantityChanged: string[];
  setCart: Dispatch<SetStateAction<CartState[]>>;
}

export default function ItemList({
    products: productsInitial,
    cart,
    itemsQuantityChanged,
    setCart
}: Props) {
  const [products, setProducts] = useState(productsInitial);

  const handleDeleteProduct = (productId: string) => {
    setProducts(
      products.filter(product => product.id !== productId)
    );

    setCart(
      cart.filter(cartItem => cartItem.product_id !== productId)
    );
  };

  const setItemQuantity = (productId: string, newQuantity: number) => {
    setCart(
      cart.map(cartItem => {
        if (cartItem.product_id === productId) {
          return {
            ...cartItem,
            quantity: newQuantity
          };
        }

        return cartItem;
      })
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {
        products.map(product =>
          <div key={product.id} >
            {
              itemsQuantityChanged.includes(product.id) &&
              <p className="text-sm text-red-400 font-bold mb-1">Количество этого товара изменилось</p>
            }
            <Item
              product={product}
              cartItem={cart.find(item => item.product_id === product.id)!}
              handleDeleteProduct={() => handleDeleteProduct(product.id)}
              setItemQuantity={(newQuantity: number) => setItemQuantity(product.id, newQuantity)}
            />
          </div>
        )
      }
    </div>
  );
}