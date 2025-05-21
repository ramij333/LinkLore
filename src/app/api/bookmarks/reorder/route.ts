import { createClient } from "@/lib/supabase/api";
import { NextResponse } from "next/server";

// PATCH /api/bookmarks/reorder
export async function PATCH(req: Request) {
  const supabase = await createClient();

  // Get the currently authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { updates } = await req.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Create a list of update promises, filtered by user_id
    const updatePromises = updates.map(
      ({ id, position }: { id: string; position: number }) =>
        supabase
          .from("bookmarks")
          .update({ position })
          .eq("id", id)
          .eq("user_id", user.id)
    );

    const results = await Promise.all(updatePromises);

    const hasError = results.some((res) => res.error);
    if (hasError) {
      console.error("One or more position updates failed:", results);
      return NextResponse.json({ error: "Failed to update positions" }, { status: 500 });
    }

    return NextResponse.json({ message: "Order updated successfully" });
  } catch (err: any) {
    console.error("Reorder error:", err);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}

