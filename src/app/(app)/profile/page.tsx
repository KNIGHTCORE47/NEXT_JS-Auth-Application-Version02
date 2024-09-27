"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ApiResponse } from '@/types/apiResponse'


function page() {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);

    async function handleUserLogout() {
        setIsLoading(true)

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

            <div className='grid grid-cols-2 gap-x-4'>
                <Button
                    onClick={() => { }}
                    className='bg-gray-500 hover:bg-gray-600'
                >
                    {
                        isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Get User"}
                </Button>

                <Button
                    onClick={handleUserLogout}
                    className='bg-red-500 hover:bg-red-600'
                >
                    {
                        isLoading ? <Loader2 className='w-4 h-4 animate-spin' /> : "Log out"
                    }
                </Button>
            </div>
        </div>
    )
}

export default page