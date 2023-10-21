export type StreamStatus = 'online' | 'offline';

export class StreamState {
  private static _status: StreamStatus = 'offline';
  private static _category = 'unknown';
  private static _startedAt: Date;
  private static _displayName = '';
  private static _title = '';

  public static get status() {
    return this._status;
  }

  public static set status(state: StreamStatus) {
    this._status = state;
  }

  public static get category() {
    return this._category;
  }

  public static set category(state: string) {
    this._category = state;
  }

  public static get startedAt(): Date {
    return this._startedAt;
  }

  public static set startedAt(startedAt: string) {
    this._startedAt = new Date(startedAt);
  }

  public static get displayName() {
    return this._displayName;
  }

  public static set displayName(state: string) {
    this._displayName = state;
  }

  public static get title() {
    return this._title;
  }

  public static set title(state: string) {
    this._title = state;
  }
}
