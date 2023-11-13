import { useRouter } from "next/navigation";

interface Props {
  stats: SellerStatistics[];
}

export default function TableMobile({ stats }: Props) {
  const router = useRouter();

  const totalGrossPay = stats.reduce((acc, statsItem) =>
    acc + statsItem.grossPay * statsItem.soldCount
  , 0)

  const totalSoldCount = stats.reduce((acc, statsItem) =>
    acc + statsItem.soldCount
  , 0)

  return (
    stats.map(statsItem =>
      <table
        onClick={() => router.push(`/products/${statsItem.product.id}`)}
        key={statsItem.product.id}
        className="text-sm text-left bg-white cursor-pointer rounded-lg transition-all hover:bg-sky-100"
      >
        <tbody>
          <tr>
            <th className="py-3 px-3 bg-sky-100 rounded-tl-lg w-[100px] break-words">Название</th>
            <td className="py-4 px-3 font-medium text-gray-900">
              {statsItem.product.title}
            </td>
          </tr>
          <tr>
            <th className="py-3 px-3 bg-sky-100 w-[100px] break-words">Текущая цена</th>
            <td className="py-4 px-3 whitespace-nowrap">
              {statsItem.product.price} ₽
            </td>
          </tr>
          <tr>
            <th className="py-3 px-3 bg-sky-100 w-[100px] break-words">Осталось</th>
            <td className="py-4 px-3">
              {statsItem.product.quantity}
            </td>
          </tr>
          <tr>
            <th className="py-3 px-3 bg-sky-100 w-[100px] break-words">Продано</th>
            <td className="py-4 px-3">
              {statsItem.soldCount}
            </td>
          </tr>
          <tr>
            <th className="py-3 px-3 bg-sky-100 rounded-bl-lg w-[100px] break-words">Выручка</th>
            <td className="py-4 px-3">
              {statsItem.grossPay} ₽
            </td>
          </tr>
        </tbody>
      </table>
    )
  );
}
