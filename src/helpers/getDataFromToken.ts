import { NextRequest, NextResponse } from 'next/server'
import JWT from 'jsonwebtoken'


interface TokenData {
    id: string,
    username: string,
    email: string,
    password: string,
    isVerified: boolean
}

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

        const decodedToken = JWT.verify(token, tokenSecret) as TokenData

        if (!decodedToken?.id && !decodedToken) {

            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 })
        }

        return decodedToken.id;

    } catch (error) {
        console.log("Error getting token data", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }

}