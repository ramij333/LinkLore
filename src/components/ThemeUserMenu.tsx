"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, LogIn, UserPlus, Menu } from "lucide-react";
import { toast } from "sonner";

function useAuth() {
  const [user, setUser] = useState<null | { email: string }>(null);

   useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()

        if (res.ok && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        setUser(null)
        toast.success("logged out")
      } else {
        console.error("Logout failed")
      }
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return { user, logout }
}

export default function ThemeUserMenu() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onSelect={() => setTheme(isDark ? "light" : "dark")}
          className="cursor-pointer"
        >
          {isDark ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Switch to Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Switch to Dark Mode
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem
            onSelect={async () => {
              await logout();
              router.push("/");
            }}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={() => router.push("/auth/login")}
              className="cursor-pointer"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => router.push("/auth/signup")}
              className="cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Signup
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


