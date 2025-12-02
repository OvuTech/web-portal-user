import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization');

    console.log('[Payment Proxy] Token present:', !!token);
    console.log('[Payment Proxy] Request to:', `${API_URL}/payments/initialize`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    } else {
      console.error('[Payment Proxy] No authorization token provided');
    }

    const response = await fetch(`${API_URL}/payments/initialize`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Payment Proxy] Response status:', response.status);
    if (!response.ok) {
      console.error('[Payment Proxy] Error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Payment Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}

