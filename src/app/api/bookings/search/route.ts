import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    // Check if API_URL is configured
    if (!API_URL) {
      console.error('[Search Proxy] API_URL is not configured!');
      return NextResponse.json(
        { error: 'API_URL environment variable is not configured', detail: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    console.log('[Search Proxy] API_URL:', API_URL);
    console.log('[Search Proxy] Request body:', JSON.stringify(body));

    const response = await fetch(`${API_URL}/bookings/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('[Search Proxy] Response status:', response.status);
    if (!response.ok) {
      console.error('[Search Proxy] Error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[Search Proxy] Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to search bookings', detail: error.message },
      { status: 500 }
    );
  }
}
