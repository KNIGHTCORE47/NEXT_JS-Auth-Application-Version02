import nodemailer from 'nodemailer'
import User from '@/models/user.models'
import bycryptjs from 'bcryptjs'
import SMTPConnection from 'nodemailer/lib/smtp-connection';
// import { VerificationEmail } from '../../email/verificationEmail'
// import { render } from '@react-email/render';



export interface emailExport {
    email: string,
    emailType: "VERIFY" | "RESET",
    userId: string
    verificationURL?: string
}



export async function sendEmail({ email, emailType, userId }: emailExport) {

    //NOTE - Check if email, email type and userId are provided
    if (!email || !emailType || !userId) {
        throw new Error("Email, email type and user id are required")
    }

    //NOTE - Check if environment variables are set
    const {
        NEXT_PUBLIC_SMTP_HOST,
        NEXT_PUBLIC_SMTP_PORT, NEXT_PUBLIC_SMTP_AUTH_USERNAME, NEXT_PUBLIC_SMTP_AUTH_PASSWORD
    } = process.env

    if (
        !NEXT_PUBLIC_SMTP_HOST || !NEXT_PUBLIC_SMTP_PORT || !NEXT_PUBLIC_SMTP_AUTH_USERNAME || !NEXT_PUBLIC_SMTP_AUTH_PASSWORD
    ) {
        console.log("Missing environment variables");
        throw new Error("Missing environment variables")
    }

    try {
        //NOTE - Create token and hash it
        const hashedToken = await bycryptjs.hash(userId.toString(), 10);

        //NOTE - Get user from db by id and update it with new token and Check if user requested for forgot password or verification
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordExpiry: Date.now() + 3600000
                }
            })
        }


        //NOTE - Create verification/reset password URL
        const baseUrl = String(process.env.NEXT_PUBLIC_DOMAIN) || "http://localhost:3000"

        const verificationURL = `${baseUrl}/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${hashedToken}`

        const emailContent = `
            <p>Hello ${email}</p>
            <p>Click <a href=${verificationURL}>Here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>
            <p>or</p>
            <p>Click the link below to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>
            <a href=${verificationURL}>${verificationURL}</a>
            `

        // const emailHtml = render(
        //     <VerificationEmail email={email} emailType={emailType} verificationURL={verificationURL}/>
        // )



        //NOTE - Send email with nodemailer
        const transporter = nodemailer.createTransport({
            host: String(process.env.NEXT_PUBLIC_SMTP_HOST),
            port: Number(process.env.NEXT_PUBLIC_SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: String(process.env.NEXT_PUBLIC_SMTP_AUTH_USERNAME),
                pass: String(process.env.NEXT_PUBLIC_SMTP_AUTH_PASSWORD)
            }
        })

        const mailOptions = {
            from: String(process.env.NEXT_PUBLIC_SMTP_AUTH_USERNAME) || "example@example.com",
            to: email,
            subject: emailType === "VERIFY" ? "Email verification" : "Reset forgot password",
            html: emailContent
            // || emailHtml
        }

        const mailResponse = await transporter.sendMail(mailOptions)

        return mailResponse;




    } catch (error: SMTPConnection | any) {
        console.log("Error sending email", error);
        console.log("Error response", error.response);
        console.log("Error message", error.message);
        throw new Error(error.message);

    }

}