import { getChats } from "./utils";

export type Chat = ArrayElement<Awaited<ReturnType<typeof getChats>>>;
export type Chats = Awaited<ReturnType<typeof getChats>>;