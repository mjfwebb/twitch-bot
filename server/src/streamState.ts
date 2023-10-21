export type StreamStatus = 'online' | 'offline';

let streamStatus: StreamStatus = 'offline';
let streamCategory = 'unknown';
let streamStartedAt: string;
let displayName = '';
let streamTitle = '';

export const getStreamStatus = () => streamStatus;
export const setStreamStatus = (state: StreamStatus) => (streamStatus = state);

export const getStreamCategory = () => streamCategory;
export const setStreamCategory = (state: string) => (streamCategory = state);

export const getStreamStartedAt = () => streamStartedAt;
export const setStreamStartedAt = (startedAt: string) => (streamStartedAt = startedAt);

export const getDisplayName = () => displayName;
export const setDisplayName = (state: string) => (displayName = state);

export const getStreamTitle = () => streamTitle;
export const setStreamTitle = (state: string) => (streamTitle = state);
