// ----------------------------------------------------------------------
export function flattenArray(list, key = 'children') {
  let children = [];

  const flatten = list?.map((item) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

// ----------------------------------------------------------------------
// check if array B contains all elements of array A with specific key
export function containsAll(a, b, key = 'name') {
  return a.every((itemA) => b.some((itemB) => itemB[key] === itemA[key]));
}

// ----------------------------------------------------------------------
// check if array B contains at least one element of array A with specific key
export function containsAtLeastOne(a, b, key = 'name') {
  return a.some((itemA) => b.some((itemB) => itemB[key] === itemA[key]));
}
