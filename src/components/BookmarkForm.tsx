
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { bookmarkSchema } from "@/models/bookmark-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const formSchema = bookmarkSchema.omit({ id: true, created_at: true })

type BookmarkFormProps = {
  initialData?: Partial<z.infer<typeof bookmarkSchema>>
  isEdit?: boolean
  onSubmit: (data: Partial<z.infer<typeof bookmarkSchema>>) => Promise<void>
  onCancel?: () => void
}

export function BookmarkForm({ initialData, onSubmit, isEdit, onCancel }: BookmarkFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      title: "",
      summary: "",
      favicon_url: "",
      tags: [],
      ...initialData,
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
  } = form

  // Lifted state for tags input string
  const [inputValue, setInputValue] = useState((initialData?.tags ?? []).join(", "))

  // Sync inputValue with initialData.tags changes
  useEffect(() => {
    if (initialData?.tags) {
      setInputValue(initialData.tags.join(", "))
    }
  }, [initialData])

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) reset(initialData)
  }, [initialData, reset])

  // Helper to parse tag string into array of unique trimmed tags
  const parseTags = (value: string) => {
    return value
      .split(/[, ]+/)
      .map((tag) => tag.trim())
      .filter((tag, i, arr) => tag.length > 0 && arr.indexOf(tag) === i)
  }

  // Handle input change for tags input and update RHF field value
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string[]) => void) => {
    const raw = e.target.value
    setInputValue(raw)
    const parsed = parseTags(raw)
    onChange(parsed)
  }

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit({ ...data, id: initialData?.id })
      toast.success(isEdit ? "Bookmark updated" : "Bookmark saved")
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
        <div className="grid gap-4">
          <FormField
            control={control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title of the bookmark" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <Textarea
                  className="max-h-120 overflow-y-auto resize-y"
                  placeholder="Short summary..."
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="favicon_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://favicon.com/icon.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tags field */}
          <FormField
            control={control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma or space separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. react, productivity"
                    value={inputValue}
                    onChange={(e) => handleTagsChange(e, field.onChange)}
                  />
                </FormControl>

                <div className="flex flex-wrap gap-2 mt-2">
                  {parseTags(inputValue).map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isEdit ? "Update Bookmark" : "Save Bookmark"}
        </Button>

        {!isEdit && (
          <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </form>
    </Form>
  )
}

















// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { bookmarkSchema } from "@/models/bookmark-schema"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { toast } from "sonner"
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

//  const formSchema = bookmarkSchema.omit({ id: true, created_at: true })

// // type BookmarkFormProps = {
// //   initialData?: Partial<z.infer<typeof formSchema>>
// //   isEdit?: boolean
// //   onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>
// // }

// type BookmarkFormProps = {
//   initialData?: Partial<z.infer<typeof bookmarkSchema>>  
//   isEdit?: boolean
//   onSubmit: (data: Partial<z.infer<typeof bookmarkSchema>>) => Promise<void>
//   onCancel?: () => void 
// }

// export function BookmarkForm({ initialData, onSubmit, isEdit, onCancel }: BookmarkFormProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       url: "",
//       title: "",
//       summary: "",
//       favicon_url: "",
//       tags: [],
//       ...initialData,
//     },
//   })

//   const {
//     handleSubmit,
    
//     reset,
    
//     formState: { isSubmitting },
//   } = form

//   useEffect(() => {
//     if (initialData) reset(initialData)
//   }, [initialData, reset])

//   const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       await onSubmit({...data, id: initialData?.id})
//       toast.success(isEdit ? "Bookmark updated" : "Bookmark saved")
//     } catch (error) {
//         console.log(error)
//       toast.error("Something went wrong")
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
//         <div className="grid gap-4">
//           <FormField
//             control={form.control}
//             name="url"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>URL</FormLabel>
//                 <FormControl>
//                   <Input placeholder="https://example.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Title of the bookmark" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="summary"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Summary</FormLabel>
                
//                    <Textarea  className="max-h-120 overflow-y-auto resize-y" placeholder="Short summary..." {...field} /> {/* rows={10} */}
                
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="favicon_url"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Favicon URL</FormLabel>
//                 <FormControl>
//                   <Input placeholder="https://favicon.com/icon.png" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Tags field */}
//           <FormField
//   control={form.control}
//   name="tags"
//   render={({ field }) => {
//     const [inputValue, setInputValue] = useState((field.value ?? []).join(", "))

//     const parseTags = (value: string) => {
//       return value
//         .split(/[, ]+/)
//         .map((tag) => tag.trim())
//         .filter((tag, i, arr) => tag.length > 0 && arr.indexOf(tag) === i)
//     }

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const raw = e.target.value
//       setInputValue(raw)
//       const parsed = parseTags(raw)
//       field.onChange(parsed)
//     }

//     return (
//       <FormItem>
//         <FormLabel>Tags (comma or space separated)</FormLabel>
//         <FormControl>
//           <Input
//             placeholder="e.g. react, productivity"
//             value={inputValue}
//             onChange={handleChange}
//           />
//         </FormControl>

//         <div className="flex flex-wrap gap-2 mt-2">
//           {parseTags(inputValue).map((tag, i) => (
//             <Badge key={i} variant="secondary">
//               #{tag}
//             </Badge>
//           ))}
//         </div>

//         <FormMessage />
//       </FormItem>
//     )
//   }}
// />

//         </div>

//         <Button type="submit" className="w-full" disabled={isSubmitting}>
//           {isEdit ? "Update Bookmark" : "Save Bookmark"}
//        </Button>
       
//    {!isEdit && (
//     <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
//       Cancel
//     </Button>
//   )}
       
//       </form>
//     </Form>
//   )
// }
