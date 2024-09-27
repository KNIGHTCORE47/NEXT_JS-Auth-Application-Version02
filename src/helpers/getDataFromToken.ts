import { NextRequest, NextResponse } from 'next/server'
import JWT from 'jsonwebtoken'

export default function grabTokenData(request: NextRequest) {

    const token = request.cookies.get("token")?.value ?? ""
    const tokenSecret = String(process.env.NEXT_PUBLIC_TOKEN_SECRET!) ?? ""

    try {

        if (!token) {

            return NextResponse.json({
                success: false,
                message: "No token found"
            }, { status: 404 })
        }

        const decodedToken = JWT.verify(token, tokenSecret) as {
            id: string,
            username: string,
            email: string,
            isVerified: boolean
        }

        if (!decodedToken?.id && !decodedToken) {

            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 })
        }

        const response = NextResponse.json({
            success: true,
            message: "Token found",
        }, { status: 200 })

        return {
            ...response,
            userId: decodedToken?.id
        }



    } catch (error) {
        console.log("Error getting token data", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }

}