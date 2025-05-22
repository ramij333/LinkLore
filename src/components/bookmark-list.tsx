"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark } from "@/models/bookmark-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkCard } from "./BookmarkCard";
import { toast } from "sonner";
import { BookmarkForm } from "./BookmarkForm";
import { Link as LinkIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SearchFilter } from "./SearchFilter";


export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );

  const [addOpen, setAddOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [previewData, setPreviewData] = useState<any | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isSearchMode, setIsSearchMode] = useState(false);


  useEffect(() => {
    async function fetchBookmarks() {
        setIsSearchMode(false)
      try {
        const res = await fetch("/api/bookmarks", {
          method: "GET",
        });
        // const raw = await res.json()
        // console.log("fetched bookmarks:", raw)

        if (!res.ok) {
          throw new Error("Failed to fetch bookmarks");
        }

        const data = await res.json();
        
        setBookmarks(data.bookmarks || []);
        // setBookmarks(Array.isArray(raw) ? raw : raw.data || [])
      } catch (error) {
        console.log(error)
        toast.error("Unable to load bookmarks");
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete bookmark");
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted");
    } catch (err) {
      toast.error("Error deleting bookmark");
      console.log(err);
    }
  };

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

 const handleSearch = async (search: string, tags: string[], matchAll: boolean) => {
  setLoading(true)
  setIsSearchMode(true);
  try {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (tags.length > 0) {
      params.append("tags", tags.join(","))
    }
    params.append("match", matchAll ? "all" : "any")

    const res = await fetch(`/api/bookmarks/search?${params.toString()}`)
    const data = await res.json()
    setBookmarks(data.bookmarks || [])
  } catch (err) {
    console.log(err)
    toast.error("Search failed")
  } finally {
    setLoading(false)
  }
}



  const handleEditSubmit = async (updated: Partial<Bookmark>) => {
    if (!updated.id) {
      toast.error("Missing bookmark ID");
      return;
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
      });

      if (!res.ok) throw new Error("Failed to update bookmark");

      const { bookmark } = await res.json();

      setBookmarks((prev) =>
        prev.map((b) => (b.id === bookmark.id ? bookmark : b))
      );

      setEditOpen(false);
      setSelectedBookmark(null);
    } catch (err) {
      console.error(err);
      toast.error("Error updating bookmark");
    }
  };

  const handleEdit = (id: string) => {
    const target = bookmarks.find((b) => b.id === id);
    if (target) {
      setSelectedBookmark(target);
      setEditOpen(true);
    }
  };

  const handlePreviewFetch = async () => {
    if (!urlInput.trim()) return toast.error("Enter a valid URL");
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch preview");
      setPreviewData({ ...data, url: urlInput }); // include original URL
    } catch (err: any) {
      toast.error(err.message || "Preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleNewSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const { bookmark } = await res.json();
      
      if (!res.ok) throw new Error("Failed to create bookmark");
      setBookmarks((prev) => [bookmark, ...prev]);

      
      setAddOpen(false);
      setUrlInput("");
      setPreviewData(null);
    } catch (err) {
        console.log(err)
      toast.error("Error saving bookmark");
    }
  };

  const handleCancel = () => {
  setPreviewData(null)
  setUrlInput("")
}


function SortableBookmarkCard({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return ( // {...listeners}
    <div ref={setNodeRef} style={style} {...attributes} > 
      {children}
    </div>
  );
}


const handleDragEnd = async (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
  const newIndex = bookmarks.findIndex((b) => b.id === over.id);

  const newBookmarks = arrayMove(bookmarks, oldIndex, newIndex);

  setBookmarks(newBookmarks);

  try {
    await fetch("/api/bookmarks/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: newBookmarks.map((b, index) => ({
          id: b.id,
          position: index,
        })),
      }),
    });
    toast.success("Bookmark order saved");
  } catch (err) {
    toast.error("Failed to save order");
    console.error(err);
  }
};



  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return <p className="text-muted-foreground">No bookmarks found.</p>;
  }

  return (
    
    <>
    <SearchFilter onSearch={handleSearch} />
    {isSearchMode ? (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
    {bookmarks.map((bookmark) => (
      <BookmarkCard
        key={bookmark.id}
        {...bookmark}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))}
  </div>
) : (

      <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
  <SortableContext
    items={bookmarks.map((b) => b.id)}
    strategy={verticalListSortingStrategy}
  >
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
      {bookmarks.map((bookmark) => (
        <SortableBookmarkCard key={bookmark.id} id={bookmark.id}>
          <BookmarkCard
            {...bookmark}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </SortableBookmarkCard>
      ))}
    </div>
  </SortableContext>
</DndContext>)}


      {/* Floating Action Button */}
      <Button
        className="fixed w-10 h-10 md:w-12 md:h-12 bottom-10 right-10 md:right-15 md:bottom-15 p-4 rounded-full shadow-lg"
        onClick={() => setAddOpen(true)}
      >
        <LinkIcon className="w-10 h-10" />
      </Button>

      {/* Add New Bookmark Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
          <DialogHeader className="hidden">
            <DialogTitle>URL</DialogTitle>
          </DialogHeader>
          {!previewData ? (
            <div className="p-6 space-y-8">
              <h2 className="text-xl font-semibold">Search Link</h2>
              <Input
                placeholder="Enter link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={previewLoading}
              />
              <Button
                onClick={handlePreviewFetch}
                disabled={previewLoading}
                className="w-full"
              >
                {previewLoading ? "Loading..." : "Fetch Preview"}
              </Button>
            </div>
          ) : (
            <BookmarkForm
              initialData={previewData}
              onSubmit={handleNewSubmit}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>

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
  );
}


















// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Bookmark } from "@/models/bookmark-schema";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookmarkCard } from "./BookmarkCard";
// import { toast } from "sonner";
// import { BookmarkForm } from "./BookmarkForm";
// import { Link as LinkIcon } from "lucide-react";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";


// export function BookmarkList() {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
//     null
//   );

//   const [addOpen, setAddOpen] = useState(false);
//   const [urlInput, setUrlInput] = useState("");
//   const [previewData, setPreviewData] = useState<any | null>(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const sensors = useSensors(useSensor(PointerSensor));

//   useEffect(() => {
//     async function fetchBookmarks() {
//       try {
//         const res = await fetch("/api/bookmarks", {
//           method: "GET",
//         });
//         // const raw = await res.json()
//         // console.log("fetched bookmarks:", raw)

//         if (!res.ok) {
//           throw new Error("Failed to fetch bookmarks");
//         }

//         const data = await res.json();
        
//         setBookmarks(data.bookmarks || []);
//         // setBookmarks(Array.isArray(raw) ? raw : raw.data || [])
//       } catch (error) {
//         toast.error("Unable to load bookmarks");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookmarks();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await fetch(`/api/bookmarks/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Failed to delete bookmark");
//       setBookmarks((prev) => prev.filter((b) => b.id !== id));
//       toast.success("Bookmark deleted");
//     } catch (err) {
//       toast.error("Error deleting bookmark");
//       console.log(err);
//     }
//   };

//   //   const handleEditSubmit = async (updated: Partial<Bookmark>) => {
//   //     console.log(updated)
//   //   try {
//   //     const res = await fetch(`/api/bookmarks/${updated?.id}`, {
//   //       method: "PATCH",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         url: updated.url,
//   //         title: updated.title,
//   //         summary: updated.summary,
//   //         favicon_url: updated.favicon_url,
//   //         tags: updated.tags,
//   //       }),
//   //     })

//   //     if (!res.ok) throw new Error("Failed to update bookmark")
//   //     const { bookmark } = await res.json()

//   //     setBookmarks((prev) =>
//   //       prev.map((b) => (b.id === bookmark.id ? bookmark : b))
//   //     )

//   //     toast.success("Bookmark updated")
//   //     setEditOpen(false)
//   //     setSelectedBookmark(null)
//   //   } catch (err) {
//   //     toast.error("Error updating bookmark")
//   //     console.log(err)
//   //   }
//   // }

//   const handleEditSubmit = async (updated: Partial<Bookmark>) => {
//     if (!updated.id) {
//       toast.error("Missing bookmark ID");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/bookmarks/${updated.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           url: updated.url,
//           title: updated.title,
//           summary: updated.summary,
//           favicon_url: updated.favicon_url,
//           tags: updated.tags,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update bookmark");

//       const { bookmark } = await res.json();

//       setBookmarks((prev) =>
//         prev.map((b) => (b.id === bookmark.id ? bookmark : b))
//       );

//       setEditOpen(false);
//       setSelectedBookmark(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error updating bookmark");
//     }
//   };

//   const handleEdit = (id: string) => {
//     const target = bookmarks.find((b) => b.id === id);
//     if (target) {
//       setSelectedBookmark(target);
//       setEditOpen(true);
//     }
//   };

//   const handlePreviewFetch = async () => {
//     if (!urlInput.trim()) return toast.error("Enter a valid URL");
//     setPreviewLoading(true);
//     try {
//       const res = await fetch("/api/preview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: urlInput }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch preview");
//       setPreviewData({ ...data, url: urlInput }); // include original URL
//     } catch (err: any) {
//       toast.error(err.message || "Preview failed");
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   const handleNewSubmit = async (data: any) => {
//     try {
//       const res = await fetch("/api/bookmarks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const { bookmark } = await res.json();
      
//       if (!res.ok) throw new Error("Failed to create bookmark");
//       setBookmarks((prev) => [bookmark, ...prev]);

      
//       setAddOpen(false);
//       setUrlInput("");
//       setPreviewData(null);
//     } catch (err) {
//       toast.error("Error saving bookmark");
//     }
//   };

//   const handleCancel = () => {
//   setPreviewData(null)
//   setUrlInput("")
// }


// function SortableBookmarkCard({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }


// const handleDragEnd = async (event: any) => {
//   const { active, over } = event;
//   if (!over || active.id === over.id) return;

//   const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
//   const newIndex = bookmarks.findIndex((b) => b.id === over.id);

//   const newBookmarks = arrayMove(bookmarks, oldIndex, newIndex);

//   setBookmarks(newBookmarks);

//   try {
//     await fetch("/api/bookmarks/reorder", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         updates: newBookmarks.map((b, index) => ({
//           id: b.id,
//           position: index,
//         })),
//       }),
//     });
//     toast.success("Bookmark order saved");
//   } catch (err) {
//     toast.error("Failed to save order");
//     console.error(err);
//   }
// };



//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-32 w-full rounded-xl" />
//         <Skeleton className="h-32 w-full rounded-xl" />
//         <Skeleton className="h-32 w-full rounded-xl" />
//       </div>
//     );
//   }

//   if (bookmarks.length === 0) {
//     return <p className="text-muted-foreground">No bookmarks found.</p>;
//   }

//   return (
//     <>
//       <DndContext
//   sensors={sensors}
//   collisionDetection={closestCenter}
//   onDragEnd={handleDragEnd}
// >
//   <SortableContext
//     items={bookmarks.map((b) => b.id)}
//     strategy={verticalListSortingStrategy}
//   >
//     <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
//       {bookmarks.map((bookmark) => (
//         <SortableBookmarkCard key={bookmark.id} id={bookmark.id}>
//           <BookmarkCard
//             {...bookmark}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         </SortableBookmarkCard>
//       ))}
//     </div>
//   </SortableContext>
// </DndContext>


//       {/* Floating Action Button */}
//       <Button
//         className="fixed w-10 h-10 md:w-12 md:h-12 bottom-10 right-10 md:right-15 md:bottom-15 p-4 rounded-full shadow-lg"
//         onClick={() => setAddOpen(true)}
//       >
//         <LinkIcon className="w-10 h-10" />
//       </Button>

//       {/* Add New Bookmark Dialog */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//         <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
//           <DialogHeader className="hidden">
//             <DialogTitle>URL</DialogTitle>
//           </DialogHeader>
//           {!previewData ? (
//             <div className="p-6 space-y-8">
//               <h2 className="text-xl font-semibold">Search Link</h2>
//               <Input
//                 placeholder="Enter link"
//                 value={urlInput}
//                 onChange={(e) => setUrlInput(e.target.value)}
//                 disabled={previewLoading}
//               />
//               <Button
//                 onClick={handlePreviewFetch}
//                 disabled={previewLoading}
//                 className="w-full"
//               >
//                 {previewLoading ? "Loading..." : "Fetch Preview"}
//               </Button>
//             </div>
//           ) : (
//             <BookmarkForm
//               initialData={previewData}
//               onSubmit={handleNewSubmit}
//               onCancel={handleCancel}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit Modal */}
//       {editOpen && selectedBookmark && (
//         <Dialog open={editOpen} onOpenChange={setEditOpen}>
//           <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
//             <DialogHeader className="hidden">
//               <DialogTitle>Edit Bookmark</DialogTitle>
//             </DialogHeader>
//             <BookmarkForm
//               initialData={selectedBookmark}
//               isEdit
//               onSubmit={handleEditSubmit}
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }





















// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Bookmark } from "@/models/bookmark-schema";
// import { Skeleton } from "@/components/ui/skeleton";
// import { BookmarkCard } from "./BookmarkCard";
// import { toast } from "sonner";
// import { BookmarkForm } from "./BookmarkForm";
// import { Link as LinkIcon } from "lucide-react";
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";


// export function BookmarkList() {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [editOpen, setEditOpen] = useState(false);
//   const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
//     null
//   );

//   const [addOpen, setAddOpen] = useState(false);
//   const [urlInput, setUrlInput] = useState("");
//   const [previewData, setPreviewData] = useState<any | null>(null);
//   const [previewLoading, setPreviewLoading] = useState(false);

//   useEffect(() => {
//     async function fetchBookmarks() {
//       try {
//         const res = await fetch("/api/bookmarks", {
//           method: "GET",
//         });
//         // const raw = await res.json()
//         // console.log("fetched bookmarks:", raw)

//         if (!res.ok) {
//           throw new Error("Failed to fetch bookmarks");
//         }

//         const data = await res.json();
        
//         setBookmarks(data.bookmarks || []);
//         // setBookmarks(Array.isArray(raw) ? raw : raw.data || [])
//       } catch (error) {
//         toast.error("Unable to load bookmarks");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookmarks();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       const res = await fetch(`/api/bookmarks/${id}`, {
//         method: "DELETE",
//       });
//       if (!res.ok) throw new Error("Failed to delete bookmark");
//       setBookmarks((prev) => prev.filter((b) => b.id !== id));
//       toast.success("Bookmark deleted");
//     } catch (err) {
//       toast.error("Error deleting bookmark");
//       console.log(err);
//     }
//   };

//   //   const handleEditSubmit = async (updated: Partial<Bookmark>) => {
//   //     console.log(updated)
//   //   try {
//   //     const res = await fetch(`/api/bookmarks/${updated?.id}`, {
//   //       method: "PATCH",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         url: updated.url,
//   //         title: updated.title,
//   //         summary: updated.summary,
//   //         favicon_url: updated.favicon_url,
//   //         tags: updated.tags,
//   //       }),
//   //     })

//   //     if (!res.ok) throw new Error("Failed to update bookmark")
//   //     const { bookmark } = await res.json()

//   //     setBookmarks((prev) =>
//   //       prev.map((b) => (b.id === bookmark.id ? bookmark : b))
//   //     )

//   //     toast.success("Bookmark updated")
//   //     setEditOpen(false)
//   //     setSelectedBookmark(null)
//   //   } catch (err) {
//   //     toast.error("Error updating bookmark")
//   //     console.log(err)
//   //   }
//   // }

//   const handleEditSubmit = async (updated: Partial<Bookmark>) => {
//     if (!updated.id) {
//       toast.error("Missing bookmark ID");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/bookmarks/${updated.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           url: updated.url,
//           title: updated.title,
//           summary: updated.summary,
//           favicon_url: updated.favicon_url,
//           tags: updated.tags,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to update bookmark");

//       const { bookmark } = await res.json();

//       setBookmarks((prev) =>
//         prev.map((b) => (b.id === bookmark.id ? bookmark : b))
//       );

//       setEditOpen(false);
//       setSelectedBookmark(null);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error updating bookmark");
//     }
//   };

//   const handleEdit = (id: string) => {
//     const target = bookmarks.find((b) => b.id === id);
//     if (target) {
//       setSelectedBookmark(target);
//       setEditOpen(true);
//     }
//   };

//   const handlePreviewFetch = async () => {
//     if (!urlInput.trim()) return toast.error("Enter a valid URL");
//     setPreviewLoading(true);
//     try {
//       const res = await fetch("/api/preview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: urlInput }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch preview");
//       setPreviewData({ ...data, url: urlInput }); // include original URL
//     } catch (err: any) {
//       toast.error(err.message || "Preview failed");
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   const handleNewSubmit = async (data: any) => {
//     try {
//       const res = await fetch("/api/bookmarks", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       const { bookmark } = await res.json();
      
//       if (!res.ok) throw new Error("Failed to create bookmark");
//       setBookmarks((prev) => [bookmark, ...prev]);

      
//       setAddOpen(false);
//       setUrlInput("");
//       setPreviewData(null);
//     } catch (err) {
//       toast.error("Error saving bookmark");
//     }
//   };

//   const handleCancel = () => {
//   setPreviewData(null)
//   setUrlInput("")
// }


// function SortableBookmarkCard({
//   id,
//   children,
// }: {
//   id: string;
//   children: React.ReactNode;
// }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }


//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-32 w-full rounded-xl" />
//         <Skeleton className="h-32 w-full rounded-xl" />
//         <Skeleton className="h-32 w-full rounded-xl" />
//       </div>
//     );
//   }

//   if (bookmarks.length === 0) {
//     return <p className="text-muted-foreground">No bookmarks found.</p>;
//   }

//   return (
//     <>
//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
//         {bookmarks.map((bookmark) => (
//           <BookmarkCard
//             key={bookmark?.id}
//             {...bookmark}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>

//       {/* Floating Action Button */}
//       <Button
//         className="fixed w-10 h-10 md:w-12 md:h-12 bottom-10 right-10 md:right-15 md:bottom-15 p-4 rounded-full shadow-lg"
//         onClick={() => setAddOpen(true)}
//       >
//         <LinkIcon className="w-10 h-10" />
//       </Button>

//       {/* Add New Bookmark Dialog */}
//       <Dialog open={addOpen} onOpenChange={setAddOpen}>
//         <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
//           <DialogHeader className="hidden">
//             <DialogTitle>URL</DialogTitle>
//           </DialogHeader>
//           {!previewData ? (
//             <div className="p-6 space-y-8">
//               <h2 className="text-xl font-semibold">Search Link</h2>
//               <Input
//                 placeholder="Enter link"
//                 value={urlInput}
//                 onChange={(e) => setUrlInput(e.target.value)}
//                 disabled={previewLoading}
//               />
//               <Button
//                 onClick={handlePreviewFetch}
//                 disabled={previewLoading}
//                 className="w-full"
//               >
//                 {previewLoading ? "Loading..." : "Fetch Preview"}
//               </Button>
//             </div>
//           ) : (
//             <BookmarkForm
//               initialData={previewData}
//               onSubmit={handleNewSubmit}
//               onCancel={handleCancel}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit Modal */}
//       {editOpen && selectedBookmark && (
//         <Dialog open={editOpen} onOpenChange={setEditOpen}>
//           <DialogContent className="w-full md:w-2/3 lg:w-[800px] max-h-[90vh] overflow-y-auto px-0 py-0">
//             <DialogHeader className="hidden">
//               <DialogTitle>Edit Bookmark</DialogTitle>
//             </DialogHeader>
//             <BookmarkForm
//               initialData={selectedBookmark}
//               isEdit
//               onSubmit={handleEditSubmit}
//             />
//           </DialogContent>
//         </Dialog>
//       )}
//     </>
//   );
// }
