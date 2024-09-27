"use client";

import { useParams } from 'next/navigation';
import React from 'react'


function profilePageUserParams() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className='p-4'>
            <h1
                className='text-center text-base sm:text-lg md:text-2xl'
            >
                {id}
            </h1>
        </div>
    )
}

export default profilePageUserParams
