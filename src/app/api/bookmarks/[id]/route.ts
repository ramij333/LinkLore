import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Bookmark not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { error: deleteError } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { message: "Failed to delete bookmark", error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Bookmark deleted successfully" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { url, title, tags, summary, favicon_url } = await req.json();

  if (!url && !title && !tags && !summary && !favicon_url) {
    return NextResponse.json(
      { message: "At least one field is required for update" },
      { status: 400 }
    );
  }

  const updates: Partial<{
    url: string;
    title: string;
    tags: string[];
    summary: string;
    favicon_url: string;
  }> = {};

  if (url) updates.url = url;
  if (title) updates.title = title;
  if (tags) updates.tags = tags;
  if (summary) updates.summary = summary;
  if (favicon_url) updates.favicon_url = favicon_url;

  const { data, error: updateError } = await supabase
    .from("bookmarks")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { message: "Failed to update bookmark", error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Bookmark updated successfully", bookmark: data });
}














// import { NextRequest, NextResponse } from 'next/server'
// import { createClient } from '@/lib/supabase/api'

// export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
//   const supabase = await createClient()
//   const { data: { user }, error } = await supabase.auth.getUser()

//   if (error || !user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   const { id } = context.params
//   if (!id) {
//     return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
//   }

//   const { error: deleteError } = await supabase
//     .from('bookmarks')
//     .delete()
//     .eq('id', id)
//     .eq('user_id', user.id)

//   if (deleteError) {
//     return NextResponse.json({ message: 'Failed to delete bookmark', error: deleteError.message }, { status: 500 })
//   }

//   return NextResponse.json({ message: 'Bookmark deleted successfully' })
// }

// export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
//   const supabase = await createClient()
//   const { data: { user }, error } = await supabase.auth.getUser()

//   if (error || !user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   const { id } = context.params
//   const { url, title, tags, summary, favicon_url } = await req.json()

//   if (!url && !title && !tags && !summary && !favicon_url) {
//     return NextResponse.json({ message: 'At least one field is required for update' }, { status: 400 })
//   }

//   const updates: any = {}
//   if (url) updates.url = url
//   if (title) updates.title = title
//   if (tags) updates.tags = tags
//   if (summary) updates.summary = summary
//   if (favicon_url) updates.favicon_url = favicon_url

//   const { data, error: updateError } = await supabase
//     .from('bookmarks')
//     .update(updates)
//     .eq('id', id)
//     .eq('user_id', user.id)
//     .select()
//     .single()

//   if (updateError) {
//     return NextResponse.json({ message: 'Failed to update bookmark', error: updateError.message }, { status: 500 })
//   }

//   return NextResponse.json({ message: 'Bookmark updated successfully', bookmark: data })
// }


// export async function GET(_: NextRequest, context: { params: { id: string } }) {
//   const supabase = await createClient()
//   const { data: { user }, error: userError } = await supabase.auth.getUser()

//   if (userError || !user) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//   }

//   const { id } = context.params

//   if (!id) {
//     return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })
//   }

//   const { data, error } = await supabase
//     .from("bookmarks")
//     .select("*")
//     .eq("id", id)
//     .eq("user_id", user.id)
//     .single()

//   if (error || !data) {
//     return NextResponse.json({ message: "Bookmark not found" }, { status: 404 })
//   }

//   return NextResponse.json(data)
// }









