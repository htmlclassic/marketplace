import { getOrderInfo } from './server';

interface Props {
  params: {
    orderId: string;
  }
}

export default async function Page({ params }: Props) {
  const orderId = parseInt(params.orderId);
  const data = await getOrderInfo(orderId);

  return (
    <pre className="side-padding">
      {
        data
          ?
            JSON.stringify(data, null, 2)
          :
            <h1>Такого заказа не существует</h1>
      }
    </pre>
  );
}