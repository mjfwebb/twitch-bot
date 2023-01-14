export function getDurationMilliseconds(stderr: string): number {
  const durationInSeconds = /Duration: (\d{2}:\d{2}:\d{2}\.\d{2})/g.exec(stderr);
  if (Array.isArray(durationInSeconds) && durationInSeconds.length > 1) {
    const durationString = durationInSeconds[1];
    const durationParts = durationString.split(':').map(Number);
    const durationInMilliseconds = (durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]) * 1000;
    console.log(`Duration: ${durationInMilliseconds} milliseconds`);
    return durationInMilliseconds;
  }

  return 0;
}
