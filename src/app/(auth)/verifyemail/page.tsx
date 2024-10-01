"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {

    // const router = useRouter()

    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    const verifyUserEmail = async function () {
        try {
            const response = await axios.post("/api/users/verifyemail", { token })
            setVerified(true)

            setError(false)

            console.log(response.data.message);

        } catch (error: any) {
            setError(true)
            console.log(error.response.data)
            toast.error(error.response.data)
        }
    }


    useEffect(() => {
        setError(false)

        //NOTE - Extract token using Vanilla JS
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        setError(false)

        if (token.length > 0) {
            verifyUserEmail()
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
                            token ? "You have verified your email address successfully" : "Invalid Token Parameter"
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