import React from 'react'
import clsx from 'clsx'

type Props = { className?: string }
export function Skeleton({ className }: Props) {
  return (
    <div className={clsx('animate-pulse rounded-md bg-gray-200', className)} />
  )
}
