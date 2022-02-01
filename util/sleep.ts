/**
 * 何もせずに待機し、指定した時間になったらPromiseを返す
 * @param {number} millisecond - 待機する時間(ミリ秒単位)
 * @returns {Promise<void>} - [millisecond]で指定した時間待機するだけのPromise
 */
const sleep = (millisecond: number): Promise<void> => {
  return new Promise<void>((res) => [
    setTimeout(() => {
      res();
    }, millisecond),
  ]);
};

export { sleep };
