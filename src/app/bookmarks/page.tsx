import { BookmarkList } from "@/components/bookmark-list"
import { createClient } from "@/lib/supabase/api"
import { redirect } from "next/navigation"

export default async function BookmarksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className=" min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Your Bookmarks
      </h1>
      <BookmarkList />
    </div>
  )
}
