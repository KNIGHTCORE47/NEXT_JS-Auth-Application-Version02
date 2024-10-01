import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from '@/lib/dbConfig'
import User from '@/models/user.models'
import bycryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/nodeMailer";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, username, password } = await request.json();

        //NOTE - Check if all fields are filled
        if (!email || !username || !password) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });

        }

        //NOTE - Check if user already exists by providing validated username
        const existingUserWithUsername = await User.findOne({
            username,
            isVerified: true
        });

        if (existingUserWithUsername) {
            return NextResponse.json({
                success: false,
                message: "User already exists with this username"
            }, { status: 409 });
        }


        //NOTE - Check if user already exists by providing validated email
        const existingUserWithEmail = await User.findOne({ email });

        if (existingUserWithEmail) {

            //NOTE - Check if user is already verified
            if (existingUserWithEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 409 });

            } else {

                await sendEmail({
                    email,
                    emailType: "VERIFY",
                    userId: String(existingUserWithEmail._id)
                })

                return NextResponse.json({
                    success: true,
                    message: "Verification email sent. Please check your inbox."
                }, { status: 200 });

                // const salt = await bycryptjs.genSalt(10);
                // const hashedPassword = await bycryptjs.hash(password, salt);

                // existingUserWithEmail.password = hashedPassword;

                // await existingUserWithEmail.save();

                // return NextResponse.json({
                //     success: true,
                //     message: "User Information updated successfully"
                // }, { status: 201 });

            }
        } else {
            //NOTE - if no pre existing user, create user
            if (email && username && password) {

                const salt = await bycryptjs.genSalt(10);
                const hashedPassword = await bycryptjs.hash(password, salt);


                const user = new User({
                    email,
                    username,
                    password: hashedPassword,
                    isVerified: false,
                });

                const savedUser = await user.save();

                //NOTE - Send email verification for verify email
                await sendEmail({
                    email,
                    emailType: "VERIFY",
                    userId: String(savedUser._id)
                })


                return NextResponse.json({
                    success: true,
                    message: "User created successfully. Please check your inbox.",
                    savedUser
                }, { status: 201 });
            }

        }

    } catch (error) {
        console.log("Error creating user", error);

        return NextResponse.json({
            success: false,
            message: "Error creating user",
            error
        }, { status: 500 });

    }
}