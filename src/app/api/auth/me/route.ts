import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization');

    console.log('[Me Proxy] Token present:', !!token);
    console.log('[Me Proxy] Request to:', `${API_URL}/auth/me`);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = token;
    } else {
      console.error('[Me Proxy] No authorization token provided');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    console.log('[Me Proxy] Response status:', response.status);
    if (!response.ok) {
      console.error('[Me Proxy] Error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Me Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
