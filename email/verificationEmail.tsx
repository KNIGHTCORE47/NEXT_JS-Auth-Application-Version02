"use client"

import React from 'react'
import { emailExport } from '@/helpers/nodeMailer'
import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Button,
} from '@react-email/components';

export function VerificationEmail(props: emailExport) {

    const { email, emailType, verificationURL } = props

    const previewText =
        emailType === "VERIFY" ? 'Verify your email address' : 'Reset your password';


    return (

        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>
                        {emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password'}
                    </Heading>
                    <Text style={text}>Hello {email},</Text>
                    <Text style={text}>
                        {emailType === 'VERIFY'
                            ? 'Please click the button below to verify your email address.'
                            : 'We received a request to reset your password. Click the button below to create a new password.'}
                    </Text>
                    <Section style={buttonContainer}>
                        <Button
                            className='px-4 py-2'
                            style={button}
                            href={verificationURL}
                        >
                            {emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password'}
                        </Button>
                    </Section>
                    <Text style={text}>
                        Or copy and paste this URL into your browser:
                    </Text>
                    <Text style={link}>{verificationURL}</Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        If you didn't request this email, you can safely ignore it.
                    </Text>
                </Container>
            </Body>
        </Html>

    )
}


const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
};

const h1 = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
    marginBottom: '24px',
};

const buttonContainer = {
    marginBottom: '24px',
};

const button = {
    backgroundColor: '#5F51E8',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
};

const link = {
    color: '#067df7',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
};

