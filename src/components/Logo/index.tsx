import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      src={`./logo.svg`}
      alt="Buckify logo"
      layout="fill"
      objectFit="contain"
    />
  )
}
