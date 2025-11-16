'use client'
import React from 'react'
import { absUrl } from '@/lib/format'
import Image from 'next/image'

export type GalleryProps = {
  images: Array<{ url: string; isCover: boolean }>
  title: string
}

export default function Gallery({ images, title }: GalleryProps) {
  const sorted = [...images].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover),
  )
  const [active, setActive] = React.useState(0)

  if (sorted.length === 0) {
    return <div className="aspect-[4/3] w-full rounded-xl bg-gray-100" />
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={absUrl(sorted[active].url)}
          alt={title}
          className="h-full w-full object-cover"
          width={400}
          height={300}
          loading="eager"
          unoptimized
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {sorted.map((img, i) => (
          <button
            key={img.url + i}
            type="button"
            onClick={() => setActive(i)}
            className={`aspect-video overflow-hidden rounded-md border ${i === active ? 'ring-2 ring-violet-600' : 'border-gray-200'}`}
          >
            <Image
              src={absUrl(img.url)}
              alt={`${title} ${i + 1}`}
              className="h-full w-full object-cover"
              width={400}
              height={300}
              loading="lazy"
              unoptimized
            />
          </button>
        ))}
      </div>
    </div>
  )
}
