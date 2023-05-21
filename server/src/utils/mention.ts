/**
 * Adds the "@" symbol to a string to create a mention.
 * @param str - The string to mention.
 * @returns The string with the "@" symbol added at the beginning.
 */
export function mention(str: string): `@${string}` {
  return `@${str}`;
}
