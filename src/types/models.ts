export type Country = "Colombia" | "Estados Unidos";
export type Currency = "COP" | "USD";

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: Country;
  city: string;
}

export interface Restaurant {
  id: number;
  name: string;
  country: Country;
  city: string;
  currency: Currency;
  dailySales: number;
  isOpen: boolean;
}

export interface Order {
  id: number;
  restaurantId: number;
  total: number;
  currency: Currency;
  date: string;
}
