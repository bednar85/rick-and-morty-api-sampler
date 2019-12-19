// https://youmightnotneed.com/lodash/
export const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr]
  if (chunkSize <= 0) return cache
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}

export const compare = (a, b) => {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

export const sort = (data = [], direction = 'ascending') => {
  return data.slice().sort((a, b) => {
    compare(a.toString().toLowerCase(), b.toString().toLowerCase());
  });
}

export const sortByArrayLength = (data = [], direction = 'ascending', arrayKey) => {
  const sortedData = data.slice().sort((a, b) => compare(a[arrayKey].length, b[arrayKey].length));

  if (direction === 'descending') {
    return sortedData.reverse();
  }

  return sortedData;
}
