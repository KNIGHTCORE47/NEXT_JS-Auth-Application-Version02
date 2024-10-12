"use client"

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {

    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    async function resetUserPassword() {
        try {
            setError(false)
            const response = await axios.post("/api/users/resetpassword", { token })

            if (!response) {
                console.log("Something went wrong, please try again later.")
                toast.error("Something went wrong, please try again later.")
            }

            if (response.status === 200) {
                console.log(response.data.message)
                toast.success(response.data.message)
                setVerified(true)
            }

        } catch (error: any) {
            setError(true)
            console.log(error.response.data)
            toast.error(error.response.data)

        } finally {
            setError(false)
        }
    }

    useEffect(() => {
        //NOTE - Extract token using Vanilla JS
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken);
    }, [])


    useEffect(() => {
        if (token.length > 0) {
            resetUserPassword()
        }
    }, [token])

    return (
        <div
            className='min-h-screen w-full grid place-items-center bg-black text-white'
        >
            {verified && (
                <div className='flex flex-col items-center gap-3'>
                    <h1 className='text-xl'>
                        {
                            token ? "You have reset your password successfully" : "Invalid Token Parameter"
                        }
                    </h1>

                    <h1 className='flex items-center justify-center gap-x-2'>
                        {
                            token ?
                                (
                                    <>
                                        Here is your token:
                                        <span className='text-gray-500 px-2 py-1 border-2 border-gray-500 rounded-lg'>
                                            {token}
                                        </span>
                                    </>
                                )
                                : "Invalid Token"
                        }
                    </h1>

                    <Link
                        href="/log-in"
                        className='mt-2'
                    >
                        <Button
                            className='bg-indigo-500 hover:bg-indigo-400 font-semibold'
                        >
                            Log In
                        </Button>
                    </Link>

                </div>
            )}

            {error && (
                <div>
                    <h2
                        className='text-red-500 text-2xl'
                    >
                        Error!!
                    </h2>
                </div>
            )}

        </div>
    )
}
