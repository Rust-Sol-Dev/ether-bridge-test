/**
 * Retries a promise function a specified number of times before giving up.
 * @param {function} promiseFn - The promise function to retry.
 * @param {number} retriesLeft - The number of retries left.
 * @returns {Promise} A promise that resolves with the data or rejects with an error.
 */
export async function retryRPCPromise<T>(
  promiseFn: () => Promise<T>,
  retriesLeft: number,
): Promise<T> {
  if (typeof promiseFn !== 'function') {
    throw new TypeError('promiseFn must be a function');
  }
  if (typeof retriesLeft !== 'number' || retriesLeft <= 0) {
    throw new TypeError('retriesLeft must be a positive integer');
  }
  try {
    const data = await Promise.resolve(promiseFn());
    return data;
  } catch (error) {
    if (retriesLeft === 1) {
      console.error(error);
      throw error;
    }
    console.log(`${retriesLeft - 1} retries left`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return retryRPCPromise(promiseFn, retriesLeft - 1);
  }
}
