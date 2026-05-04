import { Country } from "../types/models";

// Filtrar por país
export function filterByCountry<T extends { country: Country }>(
  items: T[],
  country: Country
): T[] {
  return items.filter(item => item.country === country);
}

// Ordenar por nombre (fullName o name)
export function sortByStringField<T>(
  items: T[],
  field: keyof T,
  ascending: boolean = true
): T[] {
  return [...items].sort((a, b) => {
    const aValue = String(a[field]);
    const bValue = String(b[field]);

    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
}
