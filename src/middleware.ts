import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {

    const token = request.cookies.get("token")?.value ?? "";
    const currentUrl = request.nextUrl;

    //NOTE - If token exists and user has validated account, redirect to profile and restrict the user from accessing other routes
    if (token && (
        currentUrl.pathname === "/" ||
        currentUrl.pathname === "/sign-up" ||
        currentUrl.pathname === "/verifyemail" ||
        currentUrl.pathname === "/log-in" ||
        currentUrl.pathname === "/log-out"
    )
    ) {
        return NextResponse.redirect(new URL("/profile", request.url))
    }


    //NOTE - If there is no token and user wants to access profile, redirect user to log in and restrict the user from accessing other routes
    if (!token && currentUrl.pathname === "/profile") {
        return NextResponse.redirect(new URL("/log-in", request.url))
    }

    //NOTE - Token exists and user has validated account, allow user to access other routes
    return NextResponse.next()

}


export const config = {
    matcher: [
        "/",
        "/sign-up",
        "/verifyemail",
        "/log-in",
        "/log-out",
        "/profile",
    ]
}