export function linearSearch<T>(
  items: T[],
  predicate: (item: T) => boolean
): T | null {
  for (let item of items) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}

export function binarySearch(
  items: number[],
  target: number
): number {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (items[mid] === target) {
      return mid;
    }

    if (items[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
