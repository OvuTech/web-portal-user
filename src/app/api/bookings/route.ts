import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    // Check if API_URL is configured
    if (!API_URL) {
      console.error('[Booking Proxy] API_URL is not configured!');
      return NextResponse.json(
        { error: 'API_URL environment variable is not configured', detail: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const token = request.headers.get('Authorization');

    // Log for debugging
    console.log('[Booking Proxy] API_URL:', API_URL);
    console.log('[Booking Proxy] Token present:', !!token);
    console.log('[Booking Proxy] Token value:', token ? token.substring(0, 30) + '...' : 'none');
    console.log('[Booking Proxy] Request to:', `${API_URL}/bookings/`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    } else {
      console.error('[Booking Proxy] No authorization token provided');
    }

    const response = await fetch(`${API_URL}/bookings/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Booking Proxy] Response status:', response.status);
    console.log('[Booking Proxy] Response data:', JSON.stringify(data));
    
    if (!response.ok) {
      console.error('[Booking Proxy] Error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Booking Proxy] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create booking', detail: error.message },
      { status: 500 }
    );
  }
}
