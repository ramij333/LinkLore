

import { z } from "zod"

export const bookmarkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  summary: z.string(),
  favicon_url: z.string().url(),
  created_at: z.string(), 
  tags: z.array(z.string()).optional(),
})

export type Bookmark = z.infer<typeof bookmarkSchema>

