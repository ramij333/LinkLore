"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface SearchFilterProps {
  onSearch: (search: string, tags: string[], matchAll: boolean) => void
}

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)
  const [matchAll, setMatchAll] = useState(false)
  const [hasActiveSearch, setHasActiveSearch] = useState(false)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/bookmarks/tags")
        const data = await res.json()
        setTags(data.tags || [])
      } catch (err) {
        console.log(err)
        toast.error("Failed to load tags")
      }
    }

    fetchTags()
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSearch = () => {
    // Set this state to true if search or tags exist, false otherwise
    const active = search.trim().length > 0 || selectedTags.length > 0
    setHasActiveSearch(active)

    // Call parent onSearch prop with current filters
    onSearch(search.trim(), selectedTags, matchAll)
  }

  const handleCancel = () => {
    setSearch("")
    setSelectedTags([])
    setShowTags(false)
    setMatchAll(false)
    setHasActiveSearch(false)
    onSearch("", [], false) // reset parent search results
  }

  return (
    <div className="w-full space-y-4 mb-6">
      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search bookmarks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:flex-1"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="secondary" onClick={() => setShowTags(prev => !prev)}>
          {showTags ? "Hide Tags" : "Tags"}
        </Button>
        {/* Always show Cancel button */}
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {showTags && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              onClick={() => toggleTag(tag)}
              className={`cursor-pointer transition-all ${
                selectedTags.includes(tag) ? "ring ring-ring" : ""
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {selectedTags.length > 1 && (
        <div className="flex items-center  gap-2">
          <Switch checked={matchAll} onCheckedChange={setMatchAll} />
          <span>Match all tags</span>
        </div>
      )}

      {/* Show this only if there is an active search or tags */}
      {hasActiveSearch && (
        <div className="text-sm text-muted-foreground">
          Showing results for:
          {search && <span className="font-medium"> &quot{search}&quot</span>}
          {selectedTags.length > 0 && (
            <span className="font-medium">
              {search ? " + " : ""}
              {selectedTags.join(", ")}
            </span>
          )}
        </div>
      )}
    </div>
  )
}















// "use client"

// import { useEffect, useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"

// interface SearchFilterProps {
//   onSearch: (search: string, tags: string[]) => void
// }

// export function SearchFilter({ onSearch }: SearchFilterProps) {
//   const [search, setSearch] = useState("")
//   const [tags, setTags] = useState<string[]>([])
//   const [selectedTags, setSelectedTags] = useState<string[]>([])

//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const res = await fetch("/api/bookmarks/tags")
//         const data = await res.json()
//         setTags(data.tags || [])
//       } catch (err) {
//         toast.error("Failed to load tags")
//       }
//     }

//     fetchTags()
//   }, [])

//   const toggleTag = (tag: string) => {
//     setSelectedTags(prev =>
//       prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
//     )
//   }

//   return (
//     <div className="w-full space-y-4 mb-6">
//       <div className="flex gap-2">
//         <Input
//           placeholder="Search bookmarks..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="w-full"
//         />
//         <Button onClick={() => onSearch(search, selectedTags)}>Search</Button>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {tags.map(tag => (
//           <Badge
//             key={tag}
//             variant={selectedTags.includes(tag) ? "default" : "outline"}
//             onClick={() => toggleTag(tag)}
//             className="cursor-pointer"
//           >
//             {tag}
//           </Badge>
//         ))}
//       </div>
//     </div>
//   )
// }



