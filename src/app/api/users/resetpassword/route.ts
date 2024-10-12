import { dbConnect } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";


export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { token } = await request.json();
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpiry: { $gt: Date.now() }
        })

        //NOTE - Check if token is valid
        if (!user) {
            console.log("Invalid token");

            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 })
        } else {
            //NOTE - Update user details
            user.isVerified = true;
            user.forgotPasswordToken = undefined;
            user.forgotPasswordExpiry = undefined;

            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Password reset successfully"
        }, { status: 200 })

    } catch (error) {
        console.log("Error resetting password", error);

        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 })
    }

}