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

export const sortByArrayLength = (data = [], direction = 'ascending', arrayKey) => {
  const sortedData = data.slice().sort((a, b) => compare(a[arrayKey].length, b[arrayKey].length));

  return direction === 'descending' ? sortedData.reverse() : sortedData;
}
