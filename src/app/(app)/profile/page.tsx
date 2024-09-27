"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Ellipsis, Loader2 } from 'lucide-react'
import { ApiResponse } from '@/types/apiResponse'
import Link from 'next/link'


function page() {
    const router = useRouter();

    const [userId, setUserId] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLogOut, setIsLogOut] = React.useState<boolean>(false);

    async function handleUserInfo() {
        setIsLoading(true)
        setUserId("")

        try {
            const response = await axios.get('/api/profile')

            if (!response) {
                console.log("Something went wrong, please try again later.");

                toast.error(
                    "Something went wrong, please try again later."
                );
            } else if (response.status === 200) {
                setUserId(response.data.data?._id)
                toast.success(response.data.data.message ?? "User fetched successfully")

            }

        } catch (error) {
            console.log("Error getting user info", error);
            const axiosError = error as AxiosError<ApiResponse>;

            toast.error(axiosError?.response?.data.message ?? "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUserLogout() {
        setIsLogOut(true)

        try {
            const response = await axios.get('/api/users/log-out')

            if (!response) {
                console.log("Something went wrong, please try again later.")
                toast.error(
                    "Something went wrong, please try again later."
                )

            } else if (response.status === 200) {
                toast.success(response.data.message ?? "Logged out successfully")

                router.replace('/log-in')
            }



        } catch (error) {
            console.log("Error logging out", error);
            const axiosError = error as AxiosError<ApiResponse>;

            toast.error(axiosError?.response?.data.message ?? "An unexpected error occurred")
        } finally {
            setIsLogOut(false)
        }

    }


    return (
        <div
            className='
            bg-black text-white min-h-screen grid place-content-center gap-y-4'
        >
            <h1 className='text-3xl text-center'>
                Profile
            </h1>

            <hr />

            <h1 className='text-xl text-center'>
                {
                    userId === "" ? (
                        <>
                            <span className='flex items-center justify-center gap-2'>
                                Fetching user<Ellipsis className='w-6 h-6 animate-bounce' />
                            </span>
                        </>
                    ) : (
                        <Link
                            href={`/profile/${userId}`}
                            className='text-center hover:text-gray-400 duration-300'
                        >
                            {userId}
                        </Link>
                    )
                }
            </h1>

            <hr />

            <div className='grid grid-cols-2 gap-x-4'>
                <Button
                    onClick={handleUserInfo}
                    className='bg-gray-500 hover:bg-gray-600 font-semibold'
                >
                    {
                        isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Get User"}
                </Button>

                <Button
                    onClick={handleUserLogout}
                    className='font-semibold bg-red-500 hover:bg-red-600'
                >
                    {
                        isLogOut ? <Loader2 className='w-4 h-4 animate-spin' /> : "Log out"
                    }
                </Button>
            </div>
        </div>
    )
}

export default page