import { dbConnect } from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.models";
import { sendEmail } from "@/helpers/nodeMailer";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password, confirmPassword } = await request.json();

        //NOTE - Check if all fields are filled
        if (!email || !password || !confirmPassword) {
            return NextResponse.json({
                success: false,
                message: "Please provide valid details",
            }, { status: 400 });
        }

        //NOTE - Check if user exists
        const existingUser = await User.findOne({ email });

        //NOTE - Check if user exists
        if (!existingUser) {
            // console.log("User does not exist");
            return NextResponse.json({
                success: false,
                message: "User does not exist",
            }, { status: 404 });
        }

        if (existingUser) {

            if (existingUser?.password === password) {
                return NextResponse.json({
                    success: false,
                    message: "Please provide different password",
                }, { status: 409 });
            }

            if (password !== confirmPassword) {
                return NextResponse.json({
                    success: false,
                    message: "Passwords do not match",
                }, { status: 409 });

            }

            //NOTE - Send email
            await sendEmail({
                email,
                emailType: "RESET",
                userId: String(existingUser?._id),
            })

            return NextResponse.json({
                success: true,
                message: "Please check your email to reset password",
            }, { status: 200 });
        }



    } catch (error) {
        console.log("Error resetting password", error);
        return NextResponse.json({
            success: false,
            message: "Error resetting password",
        }, { status: 500 });
    }
}