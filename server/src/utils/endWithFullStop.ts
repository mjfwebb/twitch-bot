export function endWithFullStop(text: string) {
  const punctuationMarks = ['.', ':', '?', '!'];
  if (punctuationMarks.some((mark) => text.endsWith(mark))) {
    return text;
  }
  return `${text}.`;
}
