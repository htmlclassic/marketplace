import { getOrders } from "./utils";

export type Orders = Awaited<ReturnType<typeof getOrders>>;
export type Order = ArrayElement<NonNullable<Orders>>;