import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secretKey = process.env.JWT_SECRET || 'my-super-secret-key-12345'; // Use your secret key here

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: secretKey });

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch('http://localhost:4000/api/verify-jwt', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.accessToken}`, // Ensure you are passing the token correctly
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/verify-session:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}
