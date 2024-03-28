import { getInitialOrders } from "./utils";

export type Orders = Awaited<ReturnType<typeof getInitialOrders>>;
export type Order = ArrayElement<NonNullable<Orders>>;