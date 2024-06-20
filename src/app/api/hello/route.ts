//testing api
import { NextRequest, NextResponse } from 'next/server';

// Inside app/api/route.ts
// This will create end point GET http://localhost:3000/api/hello

// Test this like http://localhost:3000/api/hello?name=Meera

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  return NextResponse.json({ name });
}

// This will create end point POST http://localhost:3000/api/hello

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();

    return NextResponse.json(json);
  } catch (e) {
    console.log(e);
    return new Response(null, { status: 400, statusText: 'Bad Request' });
  }
}
