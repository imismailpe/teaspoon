import React from 'react'

export default function Ingredient({ name, quantity }: { name: string, quantity: string }) {
  return (
    <div className='flex w-full justify-between items-center p-2 border-b border-gray-300 dark:border-gray-600'>
      <span>{name}</span>
      <span>{quantity}</span>
    </div>
  )
}
