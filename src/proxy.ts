import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data } = await supabase.auth.getUser()
    const user = data?.user

    // Protected routes
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
    const isAdmin = request.nextUrl.pathname.startsWith('/admin')

    if ((isDashboard || isAdmin) && !user) {
        // Mock auth bypass: return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin check (simple version)
    if (isAdmin && user?.email !== 'admin@apex.com') {
        // In a real app, you'd check the 'role' in the profiles table
        // but middleware can't easily fetch DB data without more setup.
        // For now, this is a placeholder check.
        // Mock auth bypass: return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
