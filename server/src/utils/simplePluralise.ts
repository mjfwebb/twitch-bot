/**
 *
 * @param word
 * @param count
 * @returns The word pluralised by adding s to the end if count is not 1
 */
export const simplePluralise = (word: string, count: number): string => {
  if (count === 1) {
    return word;
  }
  return `${word}s`;
};
