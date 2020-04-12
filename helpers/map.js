/**
 *
 * @param {Array} arr
 * @param {string|function} key
 * @returns {{}}
 */
export function indexBy(arr, key) {
  const isFunc = typeof key ==='function';
  const map = {};
  for (let item of arr) {
    map[isFunc ? key(item) : key] = item;
  }

  return map;
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
