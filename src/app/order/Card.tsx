'use client';

import clsx from "clsx";
import { BankCardData } from "./types";

interface Props {
  setCardNumber: (cardNumber: string) => void;
  setCVC: (cvc: string) => void;
  setExpirationDate: (expDate: string) => void;
  bankCardData: BankCardData;
  show: boolean;
  hideCard: () => void;
  handleBuy: () => void;
}

function isBankCardDataValid(bankCardData: BankCardData) {
  if (
    bankCardData.cardNumber !== '' &&
    bankCardData.expDate !== '' &&
    bankCardData.cvc !== ''
  ) {
    return true;
  }

  return false;
}

export default function Card({
  bankCardData,
  setCardNumber,
  setCVC,
  setExpirationDate,
  handleBuy,
  hideCard,
  show
}: Props) {
  return (
    <div
      className={clsx({
        "absolute left-0 top-0 justify-center items-center w-full h-full bg-white overflow-hidden": true,
        "flex": show,
        "hidden": !show
      })}
    >
      <button
        onClick={hideCard}
        className="absolute top-10 left-10 border p-2"
      >Назад</button>
      <form
        onSubmit={e => {
          e.preventDefault();

          if (isBankCardDataValid(bankCardData)) {
            handleBuy();
          }
        }}
        className={clsx({
          "flex flex-wrap gap-3 p-5 max-w-sm": true,
        })}
      >
        <label className="relative w-full flex flex-col">
          <span className="font-bold mb-3">Card number</span>
          <input
            value={bankCardData.cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
            type="text" name="card_number"
            placeholder="0000 0000 0000 0000"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </label>

        <label className="relative flex-1 flex flex-col">
          <span className="font-bold mb-3">Expire date</span>
          <input
            value={bankCardData.expDate}
            onChange={e => setExpirationDate(e.target.value)}
            className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
            type="text"
            placeholder="MM/YY"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </label>

        <label className="relative flex-1 flex flex-col">
          <span className="font-bold flex items-center gap-3 mb-3">
            CVC/CVV
            <span className="relative group">
              <span className="hidden group-hover:flex justify-center items-center px-2 py-1 text-xs absolute -right-2 transform translate-x-full -translate-y-1/2 w-max top-1/2 bg-black text-white"> Код с задней стороны карты </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </span>
          <input
            value={bankCardData.cvc}
            onChange={e => setCVC(e.target.value)}
            className="rounded-md peer pl-12 pr-2 py-2 border-2 border-gray-200 placeholder-gray-300"
            type="text"
            placeholder="&bull;&bull;&bull;"
            required
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-black peer-placeholder-shown:text-gray-300 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </label>
        <button className="border p-2">Оплатить</button>
      </form>
    </div>
  );
}