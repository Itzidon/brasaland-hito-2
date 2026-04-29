export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.length >= 8;
}

export function isValidCustomer(customer: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}): boolean {
  if (customer.fullName.length < 3) return false;
  if (!isValidEmail(customer.email)) return false;
  if (!isValidPhone(customer.phone)) return false;
  if (!customer.country) return false;
  if (customer.city.length < 2) return false;

  return true;
}
