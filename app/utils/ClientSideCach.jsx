

const ClientSideCache = (() => {
  const cache = new Map();

  return {
    set: (key, value) => {
      cache.set(key, value);
    },
    get: (key) => {
      return cache.get(key);
    },
    del: (key) => {
      cache.delete(key);
    },
  };
})();

export default {
    set: ClientSideCache.set,
    get: ClientSideCache.get,
    del: ClientSideCache.del,
}