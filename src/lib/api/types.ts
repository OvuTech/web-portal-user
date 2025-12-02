/**
 * API Types based on OVU Transport API OpenAPI specification
 */

// Common Types
export type TransportType = 'flight' | 'bus' | 'train';
export type TripType = 'one-way' | 'round-trip';
export type PassengerType = 'adult' | 'child' | 'infant';

// Search Request & Response Types
export interface SearchRequest {
  origin: string;
  destination: string;
  departure_date: string; // ISO datetime format (e.g., "2024-12-25T10:00:00")
  passengers: number; // Total number of passengers (1-10)
  return_date?: string; // ISO datetime format (for round trips)
  transport_types?: TransportType[]; // Array of transport types, defaults to all if not specified
  seat_type?: 'economy' | 'business' | 'first_class' | 'sleeper' | 'standard';
}

export interface Route {
  id: string;
  provider_reference: string; // Used for booking creation
  transport_type: TransportType;
  provider: string;
  provider_logo?: string;
  vehicle_number?: string;
  flight_number?: string;
  departure: {
    location: string;
    terminal?: string;
    time: string; // ISO datetime
    date: string; // ISO date
  };
  arrival: {
    location: string;
    terminal?: string;
    time: string; // ISO datetime
    date: string; // ISO date
  };
  duration: string; // e.g., "1h 20m"
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  available_seats?: number;
  baggage?: {
    carry_on?: string; // e.g., "7kg"
    checked?: string; // e.g., "15kg"
  };
  amenities?: string[];
}

export interface SearchResponse {
  results: Route[];
  total_results: number;
  search_id: string;
}

// Booking Types
export interface PassengerDetails {
  type: PassengerType;
  title: string; // e.g., "Mr", "Mrs", "Miss"
  first_name: string;
  last_name: string;
  date_of_birth?: string; // ISO date
  gender?: 'male' | 'female';
  email?: string;
  phone?: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  country_code: string; // e.g., "+234"
}

export interface NextOfKin {
  name: string;
  phone: string;
  country_code: string;
}

export interface CreateBookingRequest {
  provider_reference: string; // From search result
  transport_type: TransportType;
  passengers: PassengerDetails[];
  metadata?: {
    contact?: ContactDetails;
    next_of_kin?: NextOfKin;
    selected_seats?: number[];
    whatsapp_notification?: boolean;
    extra_baggage?: boolean;
  };
}

export interface Booking {
  id: string;
  booking_reference: string;
  user_id: string;
  transport_type: TransportType;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  origin: string;
  destination: string;
  departure_date: string;
  total_passengers: number;
  total_price: number;
  currency: string;
  created_at: string;
  // Optional fields that may be in metadata
  route?: Route;
  passengers?: PassengerDetails[];
  contact?: ContactDetails;
  next_of_kin?: NextOfKin;
  selected_seats?: number[];
  expires_at?: string;
}

// API returns booking directly (not wrapped)
export type CreateBookingResponse = Booking;

// Payment Types
export interface InitializePaymentRequest {
  booking_id: string;
  payment_method?: 'card' | 'bank_transfer' | 'wallet';
  callback_url?: string;
}

export interface InitializePaymentResponse {
  payment_id: string;
  authorization_url?: string;
  access_code?: string;
  reference: string;
  amount: number;
  currency: string;
}

// Authentication Types
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

// Error Response
export interface APIError {
  detail: string;
  status_code: number;
}
