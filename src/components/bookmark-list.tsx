"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Bookmark } from "@/models/bookmark-schema"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkCard } from "./BookmarkCard"
import { toast } from "sonner"
import { BookmarkForm } from "./BookmarkForm"

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const [editOpen, setEditOpen] = useState(false)
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "GET",
        })
        // const raw = await res.json()
        // console.log("fetched bookmarks:", raw)

        if (!res.ok) {
          throw new Error("Failed to fetch bookmarks")
        }

        const data = await res.json()
        console.log(data)
        setBookmarks(data.bookmarks || [])
        // setBookmarks(Array.isArray(raw) ? raw : raw.data || [])
      } catch (error) {
    
        toast.error("Unable to load bookmarks")
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  const handleDelete = async (id: string) => {
    try {
        const res = await fetch(`/api/bookmarks/${id}`, {
            method: "DELETE",
        })
        if (!res.ok) throw new Error("Failed to delete bookmark")
        setBookmarks((prev) => prev.filter((b) => b.id !== id))
        toast.success("Bookmark deleted")
    } catch (err) {
        toast.error("Error deleting bookmark")
        console.log(err)
    }
  }

//   const handleEditSubmit = async (updated: Partial<Bookmark>) => {
//     console.log(updated)
//   try {
//     const res = await fetch(`/api/bookmarks/${updated?.id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         url: updated.url,
//         title: updated.title,
//         summary: updated.summary,
//         favicon_url: updated.favicon_url,
//         tags: updated.tags,
//       }),
//     })
   

//     if (!res.ok) throw new Error("Failed to update bookmark")
//     const { bookmark } = await res.json()

//     setBookmarks((prev) =>
//       prev.map((b) => (b.id === bookmark.id ? bookmark : b))
//     )

//     toast.success("Bookmark updated")
//     setEditOpen(false)
//     setSelectedBookmark(null)
//   } catch (err) {
//     toast.error("Error updating bookmark")
//     console.log(err)
//   }
// }


const handleEditSubmit = async (updated: Partial<Bookmark>) => {
  if (!updated.id) {
    toast.error("Missing bookmark ID")
    return
  }

  try {
    const res = await fetch(`/api/bookmarks/${updated.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: updated.url,
        title: updated.title,
        summary: updated.summary,
        favicon_url: updated.favicon_url,
        tags: updated.tags,
      }),
    })

    if (!res.ok) throw new Error("Failed to update bookmark")

    const { bookmark } = await res.json()

    setBookmarks((prev) =>
      prev.map((b) => (b.id === bookmark.id ? bookmark : b))
    )

    
    setEditOpen(false)
    setSelectedBookmark(null)
  } catch (err) {
    console.error(err)
    toast.error("Error updating bookmark")
  }
}



const handleEdit = (id: string) => {
  const target = bookmarks.find((b) => b.id === id)
  if (target) {
    setSelectedBookmark(target)
    setEditOpen(true)
  }
}



  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return <p className="text-muted-foreground">No bookmarks found.</p>
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            {...bookmark}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
     {editOpen && selectedBookmark && (
  <Dialog open={editOpen} onOpenChange={setEditOpen}>
     <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
      <DialogHeader className="hidden">
        <DialogTitle>Edit Bookmark</DialogTitle>
      </DialogHeader>
      <BookmarkForm
        initialData={selectedBookmark}
        isEdit
        onSubmit={handleEditSubmit}
      />
    </DialogContent>
  </Dialog>
)}

    </>
  )
}
