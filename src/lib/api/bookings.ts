/**
 * Booking API Service
 * Handles search, booking creation, and related operations
 */

import { apiClient } from './client';
import type {
  SearchRequest,
  SearchResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  InitializePaymentRequest,
  InitializePaymentResponse,
} from './types';

export const bookingService = {
  /**
   * Search for available routes (flights, buses, trains)
   */
  async search(params: SearchRequest): Promise<SearchResponse> {
    return apiClient.post<SearchResponse>('/bookings/search', params);
  },

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> {
    return apiClient.post<CreateBookingResponse>('/bookings/', data);
  },

  /**
   * Get booking details by ID
   */
  async getBooking(bookingId: string): Promise<CreateBookingResponse> {
    return apiClient.get<CreateBookingResponse>(`/bookings/${bookingId}`);
  },

  /**
   * Initialize payment for a booking
   */
  async initializePayment(data: InitializePaymentRequest): Promise<InitializePaymentResponse> {
    return apiClient.post<InitializePaymentResponse>('/payments/initialize', data);
  },
};
