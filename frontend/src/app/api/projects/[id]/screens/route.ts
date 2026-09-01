import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const screens = await request.json();
    const token = request.cookies.get('token')?.value;

    const response = await fetch(`${API_URL}/projects/screens/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(screens),
    });

    if (!response.ok) {
      throw new Error('Failed to update project screens');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating project screens:', error);
    return NextResponse.json({ error: 'Failed to update project screens' }, { status: 500 });
  }
}
