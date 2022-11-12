import React from 'react'
import NextHead from 'next/head'

interface HeadProps {
  title: string
  description?: string
  children?: any
}

const Head: React.FC<HeadProps> = ({ title, description, children }) => {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </NextHead>
  )
}

export default Head
