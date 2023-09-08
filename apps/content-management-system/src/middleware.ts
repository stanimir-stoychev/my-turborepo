import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Clone the request headers and set a new header `x-hello-from-middleware1`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    return response;
}
