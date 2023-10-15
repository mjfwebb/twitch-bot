// Parses the source (nick and host) components of the IRC message.

export function parseSource(
  rawSourceComponent: string | null,
): { nick: string | null; host: string } | null {
  if (rawSourceComponent === null) {
    // Not all messages contain a source
    return null;
  } else {
    const sourceParts = rawSourceComponent.split("!");
    return {
      nick: sourceParts.length == 2 ? sourceParts[0] : null,
      host: sourceParts.length == 2 ? sourceParts[1] : sourceParts[0],
    };
  }
}
