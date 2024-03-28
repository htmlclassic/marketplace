import { getOrder } from "./utils";

export type Order = NonNullable<Awaited<ReturnType<typeof getOrder>>>;