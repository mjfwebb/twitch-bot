export type StreamStatus = 'online' | 'offline';

let streamStatus: StreamStatus = 'offline';
let streamCategory = '';
let streamStartedAt: string;
let displayName = '';

export const getStreamStatus = () => streamStatus;
export const setStreamStatus = (state: StreamStatus) => (streamStatus = state);

export const getStreamCategory = () => streamCategory;
export const setStreamCategory = (state: string) => (streamCategory = state);

export const getStreamStartedAt = () => streamStartedAt;
export const setStreamStartedAt = (startedAt: string) => (streamStartedAt = startedAt);

export const getDisplayName = () => displayName;
export const setDisplayName = (state: string) => (displayName = state);
