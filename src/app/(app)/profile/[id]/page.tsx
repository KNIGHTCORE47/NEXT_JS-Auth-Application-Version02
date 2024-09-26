"use client";

import { useParams } from 'next/navigation';
import React from 'react'


function page() {
    const { id } = useParams();
    return (
        <div className='bg-black text-white min-h-screen grid place-items-center'>
            <h1 className='text-center text-base sm:text-lg md:text-2xl'> Profile <span className='font-bold'>{id}</span></h1>
        </div>
    )
}

export default page
