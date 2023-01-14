export type StreamState = 'online' | 'offline';

let streamState: StreamState = 'offline';

export const getStreamState = () => streamState;

export const setStreamState = (state: StreamState) => (streamState = state);
