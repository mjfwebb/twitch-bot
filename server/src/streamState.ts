export type StreamStatus = 'online' | 'offline';

let streamStatus: StreamStatus = 'offline';
let displayName = '';

export const getStreamStatus = () => streamStatus;
export const setStreamStatus = (state: StreamStatus) => (streamStatus = state);

export const getDisplayName = () => displayName;
export const setDisplayName = (state: string) => (displayName = state);
