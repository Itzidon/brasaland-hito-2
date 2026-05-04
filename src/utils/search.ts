export function binarySearch<T>(
  items: T[],
  target: number,
  getValue: (item: T) => number
): number {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const value = getValue(items[mid]);

    if (value === target) return mid;

    if (value < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
