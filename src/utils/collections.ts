export function filterByCountry<T extends { country: string }>(
  items: T[],
  country: string
): T[] {
  return items.filter(item => item.country === country);
}

export function sortByName<T extends { fullName: string }>(
  items: T[],
  ascending: boolean = true
): T[] {
  return [...items].sort((a, b) => {
    if (a.fullName < b.fullName) return ascending ? -1 : 1;
    if (a.fullName > b.fullName) return ascending ? 1 : -1;
    return 0;
  });
}
