'use client';

import { useRouter } from "next/navigation";
import { Stats } from "./types";
import { numberWithSpaces } from "@/src/utils";

interface Props {
  stats: Stats;
}

export default function Table({ stats }: Props) {
  const router = useRouter();

  const total = stats.reduce((acc, statsItem) => acc + statsItem.total, 0);
  const totalCount = stats.reduce((acc, statsItem) => acc + statsItem.soldCount, 0);

  return (
    <div className="overflow-auto">
      <table className="text-sm text-left text-gray-500 table-fixed overflow-auto">
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
                key={statsItem.product!.id}
                className="bg-white border-b last:border-none cursor-pointer transition-all hover:bg-sky-50"
              >
                <th className="p-5 font-medium text-gray-900">
                    {statsItem.product.title}
                </th>
                <td className="p-5 whitespace-nowrap">
                    {numberWithSpaces(statsItem.product.currentPrice)} ₽
                </td>
                <td className="p-5 whitespace-nowrap">
                    {numberWithSpaces(statsItem.product.quantity)}
                </td>
                <td className="p-5 whitespace-nowrap">
                    {numberWithSpaces(statsItem.soldCount)}
                </td>
                <td className="p-5 whitespace-nowrap">
                    {numberWithSpaces(statsItem.total)} ₽
                </td>
              </tr>
            )
          }
          <tr className="bg-white">
            <th
              colSpan={3}
              className="p-5 font-bold text-gray-900 uppercase">
              Итого:</th>
            <td className="p-5 text-black font-bold whitespace-nowrap">{numberWithSpaces(totalCount)}</td>
            <td className="p-5 text-black font-bold whitespace-nowrap">{numberWithSpaces(total)} ₽</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
