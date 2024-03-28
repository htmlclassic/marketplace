import Order from './components/Order';
import { getOrder } from './utils';

interface Props {
  params: {
    orderId: string;
  }
}

export default async function Page({ params }: Props) {
  const orderId = parseInt(params.orderId);
  const order = await getOrder(orderId);

  return (
    <div className="side-padding top-margin flex justify-center grow">
      {
        order 
          ?
            <Order order={order} />
          :  
            <p>Такого заказа не существует</p>
      }
    </div>
  );
}