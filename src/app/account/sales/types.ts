import { getSellerStatistics } from "./utils";

export type Stats = NonNullable<Awaited<ReturnType<typeof getSellerStatistics>>>;