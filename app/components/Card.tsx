import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-none p-4 text-gray-800 dark:text-gray-200 border border-solid border-gray-600 dark:border-gray-400 flex flex-col gap-1'>
            {children}
        </div>
    )
}
