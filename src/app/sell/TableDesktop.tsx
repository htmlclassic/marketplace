import { useRouter } from "next/navigation";

interface Props {
  stats: SellerStatistics[];
}

export default function TableDesktop({ stats }: Props) {
  const router = useRouter();

  const totalGrossPay = stats.reduce((acc, statsItem) =>
    acc + statsItem.grossPay * statsItem.soldCount
  , 0)

  const totalSoldCount = stats.reduce((acc, statsItem) =>
    acc + statsItem.soldCount
  , 0)

  return (
    <table className="text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-white border-b border-slate-300">
        <tr>
          <th className="md:px-6 py-3 px-3">Название</th>
          <th className="md:px-6 py-3 px-3">Текущая цена</th>
          <th className="md:px-6 py-3 px-3">Осталось</th>
          <th className="md:px-6 py-3 px-3">Продано</th>
          <th className="md:px-6 py-3 px-3">Выручка</th>
        </tr>
      </thead>
      <tbody>
        {
          stats.map(statsItem =>
            <tr
              onClick={() => router.push(`/products/${statsItem.product.id}`)}
              key={statsItem.product.id}
              className="bg-white border-b last:border-none cursor-pointer transition-all hover:bg-sky-50"
            >
              <th className="md:px-6 py-4 px-3 font-medium text-gray-900 break-words">
                  {statsItem.product.title}
              </th>
              <td className="md:px-6 py-4 px-3 whitespace-nowrap">
                  {statsItem.product.price} ₽
              </td>
              <td className="md:px-6 py-4 px-3">
                  {statsItem.product.quantity}
              </td>
              <td className="md:px-6 py-4 px-3">
                  {statsItem.soldCount}
              </td>
              <td className="md:px-6 py-4 px-3">
                  {statsItem.grossPay} ₽
              </td>
            </tr>
          )
        }
        <tr className="bg-white">
          <th
            colSpan={3}
            className="md:px-6 py-4 px-3 font-bold text-gray-900 break-words uppercase">
            Итого:</th>
          <td className="md:px-6 py-4 px-3 text-black font-bold">{totalSoldCount}</td>
          <td className="md:px-6 py-4 px-3 text-black font-bold">{totalGrossPay} ₽</td>
        </tr>
      </tbody>
    </table>
  );
}
