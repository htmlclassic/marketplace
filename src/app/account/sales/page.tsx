import Table from "./Table";
import { getSellerStatistics } from "./utils";

export default async function Page() {
  const stats = await getSellerStatistics();

  if (!stats)
    return (
      <div className="grow flex items-center justify-center text-center">
        <p>Ни один из ваших товаров ещё не купили. Статистика недоступна.</p>
      </div>
    );

  return (
    <Table stats={stats} />
  );
}
