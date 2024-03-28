import { numberWithSpaces } from "@/src/utils";
import { createServerComponentSupabaseClient } from "@/supabase/utils_server";
import clsx from "clsx";
import dayjs from "dayjs";
import updateLocale from 'dayjs/plugin/updateLocale';
import Account from "./Account";

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
    "августа", "сентября", "октября", "ноября", "декабря"
  ]
})

export default async function Page() {
  const supabase = createServerComponentSupabaseClient();
  
  const { data } = await supabase
    .from('wallet')
    .select(`
      id,
      balance,

      wallet_history(
        id,
        created_at,
        action,
        sum
      )
    `)
    .order('created_at', {
      referencedTable: 'wallet_history',
      ascending: false
    })
    .limit(1)
    .single();

  if (!data) return <p>Мы не смогли загрузить данные о вашем кошельке :(</p>

  const walletHistory = groupWalletHistoryByDate(data.wallet_history);

  return (
    <div className="side-padding py-5 flex flex-col lg:flex-row gap-10 grow">
      <Account
        balance={data.balance}
        walletId={data.id}
      />
      <div className="border w-full max-h-[55vh] sm:max-h-[80vh] sm:max-w-[400px] sm:h-max rounded-3xl py-5 flex flex-col gap-5">
        <h2 className="font-medium text-xl px-5">История операций</h2>
        <div className="flex flex-col gap-3 overflow-auto pt-2">
          {
            walletHistory.map(group => {
              return (
                <div key={group[0].created_at} className="px-5 flex flex-col gap-3">
                  <div
                    className="bg-white self-center border rounded-2xl px-3 sticky top-0 shadow-[0_0_5px_1px_rgba(0,0,0,0.1)]"
                  >
                    {dateToDayAndMonth(group[0].created_at)}
                  </div>
                  <div className="flex flex-col gap-2">
                    {
                      group.map(item => {
                        const replenishment = item.action !== 'bought_product';
          
                        return (
                          <div
                            className="flex justify-between items-center gap-3"
                            key={item.id}
                          >
                            <div className="flex flex-col leading-4">
                              <span>
                                { item.action === 'sold_product' && 'Продажа товара' }
                                { item.action === 'bought_product' && 'Покупка товара' }
                                { item.action === 'deposit' && 'Пополнение баланса'}
                              </span>
                            </div>
                            <div className={clsx({
                              "text-green-400": replenishment
                            })}>
                              { replenishment ? '+ ' : '- ' }
                              { numberWithSpaces(item.sum) } ₽
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              );
            })
          }
          {
            !walletHistory.length &&
              <p className="px-5">Нет совершённых операций</p>
          }
        </div>
      </div>
    </div>
  );
}

function dateToDayAndMonth(date: string) {
  return dayjs(date).format('D MMMM');
}

type WalletHistory =  {
  id: number;
  created_at: string;
  action: "sold_product" | "bought_product" | "deposit";
  sum: number;
}[];

// splits walletHistory array into several arrays based on walletHistory[i].created_at
function groupWalletHistoryByDate(walletHistory: WalletHistory) {
  if (!walletHistory.length) return [];

  let prevDate = dateToDayAndMonth(walletHistory[0].created_at);
  let orderedWalletHistory: (typeof walletHistory)[] = walletHistory.length
    ? [ [walletHistory[0]] ]
    : [];
  let walletHistoryIndex = 0;

  for (let i = 1; i < walletHistory.length; i++) {
    const item = walletHistory[i];
    const currentDate = dateToDayAndMonth(item.created_at);

    if (currentDate !== prevDate) {
      walletHistoryIndex++;
      orderedWalletHistory[walletHistoryIndex] = [];
    };

    orderedWalletHistory[walletHistoryIndex].push(item);
    prevDate = currentDate;
  }

  return orderedWalletHistory;
}