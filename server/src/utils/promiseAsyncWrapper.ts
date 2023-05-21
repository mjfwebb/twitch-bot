/**
 * Wraps an async callback function that returns a Promise in a Promise-like manner.
 * @param callback - The async callback function.
 * @remarks Any errors thrown within the callback are logged to the console.
 */
export function promiseAsyncWrapper(callback: (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => Promise<void>) {
  new Promise<void>((resolve, reject) => {
    void (async () => {
      await callback(resolve, reject);
    })();
  }).catch((e) => console.log(e));
}
