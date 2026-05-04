import { Customer, Order, Restaurant } from "../types/models";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.trim().length >= 8;
}

export function isValidCustomer(customer: Customer): boolean {
  if (customer.fullName.trim().length < 3) return false;
  if (!isValidEmail(customer.email)) return false;
  if (!isValidPhone(customer.phone)) return false;
  if (!customer.country) return false;
  if (customer.city.trim().length < 2) return false;

  return true;
}

export function isValidRestaurant(restaurant: Restaurant): boolean {
  if (restaurant.name.trim().length < 2) return false;
  if (!restaurant.country) return false;
  if (restaurant.city.trim().length < 2) return false;
  if (restaurant.dailySales < 0) return false;

  return true;
}

export function isValidOrder(order: Order): boolean {
  if (order.restaurantId <= 0) return false;
  if (order.total < 0) return false;
  if (!order.currency) return false;
  if (!order.date) return false;

  return true;
}
