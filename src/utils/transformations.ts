export function countByCountry<T extends { country: string }>(
  items: T[]
): Record<string, number> {
  return items.reduce((acc, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function sumValues(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sumValues(numbers) / numbers.length;
}

export function maxValue(numbers: number[]): number {
  return Math.max(...numbers);
}

export function minValue(numbers: number[]): number {
  return Math.min(...numbers);
}
