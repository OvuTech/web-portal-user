import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization');

    // Log for debugging
    console.log('[Booking Proxy] Token present:', !!token);
    console.log('[Booking Proxy] Request to:', `${API_URL}/bookings`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    } else {
      console.error('[Booking Proxy] No authorization token provided');
    }

    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Booking Proxy] Response status:', response.status);
    if (!response.ok) {
      console.error('[Booking Proxy] Error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Booking Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
