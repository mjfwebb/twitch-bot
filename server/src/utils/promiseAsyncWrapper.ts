export function promiseAsyncWrapper(callback: (resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void) => Promise<void>) {
  new Promise<void>((resolve, reject) => {
    void (async () => {
      await callback(resolve, reject);
    })();
  }).catch((e) => console.log(e));
}
