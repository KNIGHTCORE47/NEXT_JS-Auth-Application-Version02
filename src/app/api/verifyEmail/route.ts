import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/lib/dbConfig'
import User from '@/models/user.models'


export async function POST(request: NextRequest) {
    await dbConnect();

    try {

        //NOTE - Get token from request
        const { token } = await request.json();
        const user = await User.findOne(
            {
                verifyToken: token,
                verifyTokenExpiry: { $gt: Date.now() }
            }
        )


        //NOTE - Check if token is valid
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 })
        } else if (user.isVerified === true) {
            //NOTE - Update user details
            user.isVerified = true;
            user.verifyToken = undefined;
            user.verifyTokenExpiry = undefined;
            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Email verified successfully"
        }, { status: 200 })



    } catch (error) {
        console.log("Error verifying email", error);

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }
}