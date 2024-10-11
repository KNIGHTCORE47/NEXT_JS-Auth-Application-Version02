"use client"

import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { z as zod } from 'zod'
import { forgotPasswordSchema as fgPassSchema } from '@/schemas/forgotPasswordSchema'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ApiResponse } from '@/types/apiResponse'

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
import { Loader2 } from 'lucide-react'

export default function ForgotPasswordPage() {

    const [isSubmiting, setIsSubmiting] = useState(false)

    const router = useRouter()

    const form = useForm<zod.infer<typeof fgPassSchema>>({
        resolver: zodResolver(fgPassSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    async function onSubmit(data: zod.infer<typeof fgPassSchema>) {
        setIsSubmiting(true)

        try {
            const response = await axios.post('/api/users/forgot-password', data)

            if (!response) {
                console.log("Something went wrong, please try again later.");
                toast.error("Something went wrong, please try again later.");
            }

            if (response.status === 200) {
                toast.success(response.data.message ?? "Email sent successfully.");
                router.replace('/log-in')
            }

        } catch (error) {
            console.log("Error forgot password", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError?.response?.data.message ?? "An unexpected error occurred");
        } finally {
            setIsSubmiting(false)
            form.reset()
        }

    }




    return (
        <div
            className='min-h-screen grid place-items-center bg-black text-white'
        >
            <div
                className='w-[400px] px-4 py-8 flex flex-col items-center justify-center gap-y-4 rounded-2xl border-2 border-gray-600'
            >
                <h1 className='text-3xl'>Forgot Password</h1>

                <div className='w-full'>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">


                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
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
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <Button
                                className='bg-gray-700 text-white hover:bg-gray-800
                                focus:outline-none focus:border-gray-700'
                                type="submit"
                            >
                                {isSubmiting ? (
                                    <>
                                        <Loader2 className='w-4 h-4 animate-spin' />
                                        <span className='ml-2'>Please wait...</span>
                                    </>
                                ) : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    )
}
