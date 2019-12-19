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

export const sortByKey = (data = [], direction = 'ascending', type = 'alphabetical', sortKey) => {
  let sortedData = data;

  console.log('  sort util');

  if (type === 'numerical') {
    console.log('  numerical');
    sortedData = data.slice().sort((a, b) => compare(a[sortKey], b[sortKey]));
  } else {
    console.log('  else');
    sortedData = data.slice().sort((a, b) => 
      compare(a[sortKey].toString().toLowerCase(), b[sortKey].toString().toLowerCase())
    );
  }

  return direction === 'descending' ? sortedData.reverse() : sortedData;
}

export const sortByArrayLength = (data = [], direction = 'ascending', arrayKey) => {
  const sortedData = data.slice().sort((a, b) => compare(a[arrayKey].length, b[arrayKey].length));

  return direction === 'descending' ? sortedData.reverse() : sortedData;
}
