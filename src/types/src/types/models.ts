export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: "Colombia" | "Estados Unidos";
  city: string;
}

export interface ServiceRequest {
  id: number;
  customerId: number;
  serviceType: "reserva" | "evento" | "catering";
  eventDate: string;
  guestCount: number;
  estimatedBudget?: number;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
}
