export enum Errors {
  EMPTY_ADDRESS = 'Address is empty',
  EMPTY_CART = 'Cart is empty',
  LOW_BALANCE = 'Balance is less than total products\' price',
  PRODUCTS_QUANTITY_CHANGED = 'There are more items in the cart than in the database',
  PRODUCTS_DONT_EXIST = 'Some of the products in the cart were deleted',
  CREATE_ORDER_ERROR = 'Couldn\'t create an order'
};

export interface BankCardData {
  cardNumber: string;
  expDate: string;
  cvc: string;
}