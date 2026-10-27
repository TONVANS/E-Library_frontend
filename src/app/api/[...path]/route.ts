import type { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/api-config';

const BACKEND_URL = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://training-api.edl.com.la/elibrary'
).replace(/\/$/, '');

// Hop-by-hop headers and ones that fetch() recomputes; forwarding them breaks the proxied request/response
const STRIP_REQUEST_HEADERS = ['host', 'connection', 'content-length', 'accept-encoding', 'cookie'];
const STRIP_RESPONSE_HEADERS = ['connection', 'content-encoding', 'content-length', 'transfer-encoding'];

async function forward(request: NextRequest, { params }: RouteContext<'/api/[...path]'>) {
  const { path } = await params;
  const target = `${BACKEND_URL}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  STRIP_REQUEST_HEADERS.forEach((h) => headers.delete(h));

  // Direct links (e.g. opening a PDF in a new tab) carry no Authorization header, so fall back to the cookie
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!headers.has('authorization') && token) {
    headers.set('authorization', `Bearer ${token}`);
  }

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  let res: Response;
  try {
    res = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      // Required by fetch when streaming a request body (multipart uploads)
      ...(hasBody ? { duplex: 'half' } : {}),
      redirect: 'manual',
      cache: 'no-store',
    } as RequestInit);
  } catch {
    return Response.json({ message: 'Backend API is unreachable' }, { status: 502 });
  }

  const responseHeaders = new Headers(res.headers);
  STRIP_RESPONSE_HEADERS.forEach((h) => responseHeaders.delete(h));

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
  forward as HEAD,
  forward as OPTIONS,
};
