"use client"

import React from 'react'
import { emailExport } from '@/helpers/nodeMailer'

function verificationEmail({ emailType, verificationURL }: emailExport) {
    return (
        <div className='min-h-screen w-full text-center m-auto'>
            {
                emailType === "VERIFY" ? (
                    <div >
                        <h1>Verify your email</h1>
                        <p>Please click the link below to verify your email.</p>
                        <a href={verificationURL}>Verify Email</a>
                        <p>Alternatively, you can copy and paste the following link:</p>
                        <p>{verificationURL}</p>
                        <p>Best regards,</p>
                        <p>[Your Name/Company]</p>
                    </div>
                ) : (
                    <div>
                        <h1>Reset Your Password</h1>
                        <p>We received a request to reset your password.</p>
                        <p>Click the link below to create a new password:</p>
                        <a href={verificationURL}>Reset Password</a>
                        <p>Alternatively, you can copy and paste the following link:</p>
                        <p>{verificationURL}</p>
                        <p>If you didn't request this, please ignore this email.</p>
                        <p>Best regards,</p>
                        <p>[Your Name/Company]</p>
                    </div>
                )
            }
        </div>
    )
}

export default verificationEmail
