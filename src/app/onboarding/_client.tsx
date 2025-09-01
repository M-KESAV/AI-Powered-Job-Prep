"use client"

import { getUser, createUserFromClerk } from "@/features/users/actions"
import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()
  const [retryCount, setRetryCount] = useState(0)
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const maxRetries = 20 // Reduced since we have better user creation logic

  // Handle redirects in a separate effect to avoid React warnings
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        router.replace(shouldRedirect)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [shouldRedirect, router])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    let isMounted = true

    const checkUser = async () => {
      if (!isMounted) return
      
      try {
        // First check if user exists
        let user = await getUser(userId)
        
        if (!user && !isCreatingUser && retryCount < 3) {
          // If user doesn't exist and we haven't tried creating them yet, try to create
          setIsCreatingUser(true)
          try {
            console.log(`Attempting to create user ${userId} from Clerk...`)
            user = await createUserFromClerk(userId)
            console.log(`Successfully created user:`, user)
          } catch (createError) {
            console.error('Failed to create user from Clerk:', createError)
          } finally {
            setIsCreatingUser(false)
          }
        }
        
        if (!isMounted) return
        
        if (user != null) {
          if (intervalId) clearInterval(intervalId)
          setShouldRedirect("/app")
          return
        }
        
        setRetryCount(prev => {
          const newCount = prev + 1
          if (newCount >= maxRetries) {
            if (intervalId) clearInterval(intervalId)
            // Set redirect instead of calling router.replace directly
            setShouldRedirect("/sign-in")
          }
          return newCount
        })
      } catch (error) {
        if (!isMounted) return
        
        console.error("Error checking user:", error)
        setRetryCount(prev => {
          const newCount = prev + 1
          if (newCount >= maxRetries) {
            if (intervalId) clearInterval(intervalId)
            setShouldRedirect("/sign-in")
          }
          return newCount
        })
      }
    }

    // Check immediately, then every 3 seconds (less frequent since we have proactive user creation)
    checkUser()
    intervalId = setInterval(checkUser, 3000)

    return () => {
      isMounted = false
      if (intervalId) clearInterval(intervalId)
    }
  }, [userId, maxRetries, retryCount, isCreatingUser])

  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2Icon className="animate-spin size-24" />
      <div className="text-center">
        <p className="text-muted-foreground">
          {isCreatingUser 
            ? "Creating your account..." 
            : `Setting up your account... (${Math.min(retryCount + 1, maxRetries)}/{maxRetries})`
          }
        </p>
        {retryCount > 5 && (
          <p className="text-sm text-muted-foreground mt-2">
            This is taking longer than expected. Please wait...
          </p>
        )}
      </div>
    </div>
  )
}
