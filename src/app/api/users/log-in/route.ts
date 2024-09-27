import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/lib/dbConfig'
import User from '@/models/user.models'
import bycryptjs from 'bcryptjs'
import JWT from 'jsonwebtoken'


export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        //NOTE - Check if all fields are filled
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }


        //NOTE - Check if user exists
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, { status: 404 });
        }


        //NOTE - Check if password is correct
        const isPasswordCorrect = await bycryptjs.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({
                success: false,
                message: "Incorrect password"
            }, { status: 400 });
        }

        //NOTE - Generate JWT token
        const tokenSecret = String(process.env.JWT_SECRET);
        const tokenPayload = {
            id: existingUser._id,
            username: existingUser.username,
            email: existingUser.email,
            isVerified: existingUser.isVerified
        };

        const token = JWT.sign(tokenPayload, tokenSecret,
            { expiresIn: "1d" }
        );


        const response = NextResponse.json({
            success: true,
            message: "Logged in successfully",
        }, { status: 200 });

        response.cookies.set(
            "token",
            token,
            {
                httpOnly: true,
                maxAge: 60 * 60 * 24
            });

        return response;


    } catch (error) {
        console.log("Error logging in", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred"
        }, { status: 500 });

    }
}