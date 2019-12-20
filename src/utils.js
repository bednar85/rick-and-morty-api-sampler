/**
 * Capitalizes the first letter of a string. If the input is not string an empty string is returned.
 * via: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
 * @param {string} str your original string
 * @return {string} a capitalized string
 */
export const capitalize = str => {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Creates an array of elements split into groups the length of size. If array can't be split evenly, the final chunk will be the remaining elements.
 * via: https://youmightnotneed.com/lodash/
 * @param {array} arr your original array
 * @param {number} chunkSize how many items per group
 * @param {array} cache the starting point for the output array, if unspecified it starts as an empty array
 * @return {array} a grouped array
 */
export const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr]
  if (chunkSize <= 0) return cache
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}

/**
 * Compares values. Used in conjunction with Array.prototype.sort().
 * @param {string|number} a
 * @param {string|number} b
 * @return {number}
 */
export const compare = (a, b) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

/**
 * Creates an array of elements sorted based on the value of a specific property in each item of the original array.
 * @param {array} data your original array
 * @param {string} direction the sorting direction, 'ascending' or 'descending'
 * @param {string} key the key to sort by
 * @return {array} a sorted array
 */
export const sortByKey = (data = [], direction = 'ascending', type, sortKey) => {
  let sortedData = data;

  sortedData = data.slice().sort((a, b) => {
    const aSortValue = a[sortKey];
    const bSortValue = b[sortKey];

    if (type === 'numerical') {
      return compare(aSortValue, bSortValue)
    }

    return compare(
      aSortValue.toString().toLowerCase(),
      bSortValue.toString().toLowerCase()
    );
  });

  return direction === 'descending' ? sortedData.reverse() : sortedData;
}

/**
 * Creates an array of elements sorted based on the length of an array in each item of the original array.
 * @param {array} data your original array
 * @param {string} direction the sorting direction, 'ascending' or 'descending'
 * @param {string} arrayKey the key of the array to sort by
 * @return {array} a sorted array
 */
export const sortByArrayLength = (data = [], direction = 'ascending', arrayKey) => {
  const sortedData = data.slice().sort((a, b) => compare(a[arrayKey].length, b[arrayKey].length));

  return direction === 'descending' ? sortedData.reverse() : sortedData;
}
