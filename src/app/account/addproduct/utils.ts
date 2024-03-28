type CustomCharacteristics = { key: string, value: string }[];

export function removeEmptyCustomCharacteristics(customCharacterstics: CustomCharacteristics) {
  const arr: CustomCharacteristics = [];

  for (const { key, value } of customCharacterstics) {
    if (key && value) arr.push({ key, value });
  }

  return arr;
}