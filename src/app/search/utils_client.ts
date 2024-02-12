import { ReadonlyURLSearchParams } from "next/navigation";

// 1) inserts search params into params string
// 2) replaces old params if olds param are present
export function insertSearchParams(currentParams: ReadonlyURLSearchParams, paramToInsert: Object) {
  let newParams = '';

  const entries = Object.entries(paramToInsert);
  const keys = entries.map(entry => entry[0]);

  // filter existing params
  for (const [key, value] of Array.from(currentParams.entries())) {
    if (keys.includes(key)) continue;

    newParams += `${key}=${value}&`;
  }
  
  // insert new params
  for (const [key, value] of entries) {
    newParams += `${key}=${value}&`;
  }

  // delete redundant '&' character
  newParams = newParams.slice(0, -1);

  return newParams;
}