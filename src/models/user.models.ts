import mongoose from "mongoose";


export interface User extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    isAdmin: string;
    isVerified: boolean
    forgotPasswordToken: string | undefined | null;
    forgotPasswordExpiry: Date | undefined | null;
    verifyToken: string | undefined | null;
    verifyTokenExpiry: Date | undefined | null;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
}, { timestamps: true });

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema));

export default UserModel