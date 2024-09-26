"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { z as zod } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { logInSchema } from '@/schemas/logInSchema'
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react'


import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ApiResponse } from '@/types/apiResponse'


export default function LogInPage() {

    const [isSubmiting, setIsSubmiting] = useState(false)

    const router = useRouter()

    const form = useForm<zod.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    async function onSubmit(data: zod.infer<typeof logInSchema>) {
        setIsSubmiting(true)

        try {
            const response = await axios.post('/api/users/sign-up', data)

            if (!response) {
                console.log("Something went wrong, please try again later.");
                toast.error("Something went wrong, please try again later.")

            }

            if (response.status === 201) {
                toast.success(response.data.message ?? "Account created successfully.")
                form.reset()
                router.replace(`/profile/${response.data.data.username}`)
            }


        } catch (error) {
            console.log("Error signing up", error)
            const axiosError = error as AxiosError<ApiResponse>

            toast.error(axiosError?.response?.data.message ?? "An unexpected error occurred")

        } finally {
            setIsSubmiting(false)
        }

    }



    return (
        <div
            className='min-h-screen bg-black text-white flex flex-col items-center justify-center'
        >
            <div className='w-[400px] px-4 py-8 flex flex-col items-center justify-center gap-y-4 rounded-2xl border-2 border-gray-600'>
                <h1 className='text-3xl'>Login Form</h1>

                <div
                    className='w-full'
                >
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                className='w-full'
                                                placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='password'
                                                className='w-full'
                                                placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button
                                className="bg-gray-700 text-white hover:bg-gray-800
                                focus:outline-none focus:border-gray-700 
                                "
                                type="submit"
                            >
                                {isSubmiting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="ml-2">Please wait...</span>
                                    </>
                                ) : "Submit"}
                            </Button>
                        </form>
                    </Form>

                </div>

                <p className='text-sm'>
                    Don't have an account? <Link
                        href="/sign-up" className="text-blue-500"
                    >
                        Signup
                    </Link>
                </p>
            </div>

        </div>
    )
}


