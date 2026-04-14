import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/revalidate
 * Body: { subdomain: string, secret?: string }
 *
 * Called by the backend/dashboard after publishing theme changes
 * to bust Next.js server-side cache immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subdomain } = body;

    if (!subdomain) {
      return NextResponse.json({ error: 'subdomain required' }, { status: 400 });
    }

    // Revalidate the store pages for this subdomain
    revalidatePath(`/store/${subdomain}`, 'layout');

    return NextResponse.json({
      revalidated: true,
      subdomain,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
