import React from 'react'
import {PrismaClient} from "@repo/db/client"

const prisma = new PrismaClient()

const page = () => {
  return (
    <div className='bg-black h-screen'>page</div>
  )
}

export default page