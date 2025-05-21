"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft } from "lucide-react"

export function BookmarkDetails() {
  const { id } = useParams()
  const router = useRouter()
  const [bookmark, setBookmark] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const res = await fetch(`/api/bookmarks/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch bookmark")
        }
        const data = await res.json()
        setBookmark(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBookmark()
  }, [id])

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-32 py-10 space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-24 w-full mt-6" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    )
  }

  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>

  const { title, url, summary, favicon_url, tags, created_at } = bookmark

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-32 py-10 space-y-10">
      <Button
        variant="ghost"
        onClick={() => router.push("/bookmarks")}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookmarks
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
        {favicon_url && (
          <img
            src={favicon_url}
            alt="favicon"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug break-words">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            {new URL(url).hostname} •{" "}
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
        {summary}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {tags?.map((tag: string, idx: number) => (
          <Badge
            key={idx}
            variant="outline"
            className="text-sm sm:text-base px-3 py-1"
          >
            #{tag}
          </Badge>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={() => router.push("/bookmarks")}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookmarks
      </Button>
    </div>
  )
}


