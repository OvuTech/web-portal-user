import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ovu-transport-staging.fly.dev/api/v1';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const params = new URLSearchParams({ code: code || '' });
    if (state) params.append('state', state);

    const response = await fetch(`${API_URL}/auth/google/callback?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Google callback proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to complete Google authentication' },
      { status: 500 }
    );
  }
}
