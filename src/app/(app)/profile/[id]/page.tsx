"use client";

import { useParams } from 'next/navigation';
import React from 'react'


function profilePageUserParams() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className='min-h-screen grid place-items-center bg-black text-white'>
            <h1
                className='text-center text-base sm:text-lg md:text-2xl'
            >
                Here is the profile: <span className='text-gray-500 px-2 py-1 border-2 border-gray-500 rounded-lg'>{id}</span>
            </h1>
        </div>
    )
}

export default profilePageUserParams
