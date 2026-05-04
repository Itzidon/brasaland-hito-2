import { Country } from "../types/models";

// Contar elementos por país
export function countByCountry<T extends { country: Country }>(
  items: T[]
): Record<Country, number> {
  return items.reduce((acc, item) => {
    acc[item.country] = (acc[item.country] || 0) + 1;
    return acc;
  }, {} as Record<Country, number>);
}

// Sumar valores
export function sumValues(numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// Promedio
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sumValues(numbers) / numbers.length;
}

// Valor máximo
export function maxValue(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
}

// Valor mínimo
export function minValue(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
}
