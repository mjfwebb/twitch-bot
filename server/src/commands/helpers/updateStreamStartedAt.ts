import { StreamState } from '../../streamState';

export function updateStreamStartedAt(startedAt: string): void {
  StreamState.startedAt = startedAt;
}
