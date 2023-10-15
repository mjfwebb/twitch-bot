/**
 * Ensures that a given text ends with a full stop.
 * If the text already ends with a punctuation mark (. : ? !), it is returned as is.
 * Otherwise, a full stop is appended to the text.
 * @param text - The text to process.
 * @returns The text with a full stop at the end.
 */
export function endWithFullStop(text: string) {
  const punctuationMarks = [".", ":", "?", "!"];
  if (punctuationMarks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  return `${text}.`;
}
