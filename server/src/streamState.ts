export type StreamState = 'online' | 'offline';

let streamState: StreamState = 'offline';

export const getSteamState = () => streamState;

export const setStreamState = (state: StreamState) => (streamState = state);
