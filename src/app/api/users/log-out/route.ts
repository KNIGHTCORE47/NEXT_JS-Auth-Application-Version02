import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/lib/dbConfig'

export async function GET(request: NextRequest) {
    await dbConnect();

    try {

        //NOTE - Log out user
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        }, { status: 200 })


        //NOTE - Clear token from cookies
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
        })

        return response

    } catch (error: any) {
        console.log("Error logging out", error)

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }
}

