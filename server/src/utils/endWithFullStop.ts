export function endWithFullStop(text: string) {
  if (text.endsWith('.') || text.endsWith(':')) {
    return text;
  }
  return `${text}.`;
}
