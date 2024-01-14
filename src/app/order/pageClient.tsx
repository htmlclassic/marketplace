'use client';

import clsx from "clsx";
import { useContext, useState } from "react";
import Card from "./Card";
import { BankCardData, PaymentType } from "./types";
import buyItems from "./buyItems";
import { CartContext } from "@/src/CartContext";

interface Props {
  uid: string | null;
}

function sendEmail(
  orderId: number,
  to: string,
  trackLink: string = 'https://marketplace-one-hazel.vercel.app/track-order'
) {
  const data = {
    service_id: 'service_vndumiu',
    template_id: 'template_dsdlu2x',
    user_id: 'A_WhdlcbVLwO1QzHP',
    template_params: {
      hello: `Здравствуйте`,
      to,
      orderId,
      trackLink
    }
  };

  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
}

const initialBankCardData: BankCardData = {
  cardNumber: '',
  expDate: '',
  cvc: ''
};

export default function PageClient({ uid }: Props) {
  const { cart, clearCart } = useContext(CartContext);
  const [showCard, setShowCard] = useState(false);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [paymentType, setPaymentType] = useState(
    uid ? PaymentType.marketplace_account : PaymentType.bank_card
  );
  const [orderId, setOrderId] = useState<number | null>(null);
  const [bankCardData, setBankCardData] = useState(initialBankCardData);

  if (orderId) {
    return (
      <div className="side-padding">
        <h2 className="font-semibold text-3xl">Трек-код для отслеживания заказа: {orderId}</h2>
        {
          !uid &&
            <p className="text-sm">Мы также отправили трек-код вам на почту.</p>
        }
      </div>
    );
  }

  const setCardNumber = (cardNumber: string) => {
    setBankCardData({
      ...bankCardData,
      cardNumber
    });
  };

  const setCVC = (cvc: string) => {
    setBankCardData({
      ...bankCardData,
      cvc
    });
  };

  const setExpirationDate = (expDate: string) => {
    setBankCardData({
      ...bankCardData,
      expDate
    });
  };

  const handleBuy = async () => {
    try {
      const orderId = await buyItems(uid, paymentType, address, cart);

      if (!uid) {
        sendEmail(orderId, email);
      }
      
      clearCart();
      setOrderId(orderId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="relative grow flex justify-center items-center"
    >
      <Card
        bankCardData={bankCardData}
        setCardNumber={setCardNumber}
        setCVC={setCVC}
        setExpirationDate={setExpirationDate}
        handleBuy={handleBuy}
        show={showCard}
        hideCard={() => setShowCard(false)}
      />
      <form
        onSubmit={e => {
          e.preventDefault();

          if (paymentType === PaymentType.bank_card) {
            setShowCard(true);
          } else if (paymentType === PaymentType.marketplace_account) {
            handleBuy();
          }
        }}
        className="flex gap-3 flex-col items-start p-10 rounded-lg border"
      >
        <label>
          <div>Введите адрес доставки: </div>
          <input
            className="border"
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          <div>Введите email: </div>
          <input
            className="border"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required={!Boolean(uid)}
          />
        </label>
        <div className="flex gap-3">
          {
            uid &&
              <button
                type="button"
                className={clsx({
                  "border w-40 h-20 rounded-md transition-all": true,
                  "bg-green-300": paymentType === PaymentType.marketplace_account
                })}
                onClick={() => setPaymentType(PaymentType.marketplace_account)}
              >
                M Счёт
              </button>
          }
          <button
            type="button"
            className={clsx({
              "border w-40 h-20 rounded-md transition-all": true,
              "bg-green-300": paymentType === PaymentType.bank_card
            })}
            onClick={() => setPaymentType(PaymentType.bank_card)}
          >
            Банковская карта
          </button>
        </div>
        <button
          className="p-3 border"
        >Оплатить онлайн</button>
      </form>
    </div>
  );
}