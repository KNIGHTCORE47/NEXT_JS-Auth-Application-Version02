import { NextResponse, NextRequest } from 'next/server'
import grabTokenData from '@/helpers/getDataFromToken'
import User from '@/models/user.models'
import { dbConnect } from '@/lib/dbConfig'


export async function GET(request: NextRequest): Promise<any> {
    await dbConnect();

    try {

        //NOTE - Get user from token
        const userId = await grabTokenData(request);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Invalid token",
            }, { status: 401 });

        }

        const user = await User.findOne({ _id: userId }).select("-password");


        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user,
        }, { status: 200 });



    } catch (error) {
        console.log("Error getting profile", error);
        return NextResponse.json({
            success: false,
            message: "An unexpected error occurred",
        }, { status: 500 });
    }
}