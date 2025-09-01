"use server"

import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getUserIdTag } from "./dbCache"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { clerkClient } from "@clerk/nextjs/server"
import { upsertUser } from "./db"

export async function getUser(id: string) {
  "use cache"
  cacheTag(getUserIdTag(id))

  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, id),
    })
    return user
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createUserFromClerk(userId: string) {
  "use server"
  
  try {
    // Check if user already exists
    const existingUser = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    })
    
    if (existingUser) {
      return existingUser
    }

    // Get user data from Clerk
    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)
    
    if (!clerkUser) {
      throw new Error(`User ${userId} not found in Clerk`)
    }

    // Get primary email
    const email = clerkUser.emailAddresses.find(
      e => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress
    
    if (!email) {
      throw new Error(`No primary email found for user ${userId}`)
    }

    // Create user in database
    const userData = {
      id: clerkUser.id,
      email,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0],
      imageUrl: clerkUser.imageUrl || '',
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    }

    await upsertUser(userData)
    
    // Return the created user
    return await db.query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
    })
  } catch (error) {
    console.error(`Error creating user from Clerk ${userId}:`, error)
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
