'use server';

import { revalidatePath } from "next/cache";

export async function revalidate(path: string | string[]) {
  let paths = path as string[];

  if (!Array.isArray(path)) {
    paths = [ path ];
  }

  paths.forEach(path => revalidatePath(path));
}