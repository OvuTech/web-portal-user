import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Login Proxy] Forwarding login request to:', `${API_URL}/auth/login`);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('[Login Proxy] Response status:', response.status);
    console.log('[Login Proxy] Has access_token:', !!data.access_token);

    if (!response.ok) {
      console.error('[Login Proxy] Login failed:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Login Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
