import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}









// import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
// import { type NextApiRequest, type NextApiResponse } from 'next'

// export default function createClient(req: NextApiRequest, res: NextApiResponse) {
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }))
//         },
//         setAll(cookiesToSet) {
//           res.setHeader(
//             'Set-Cookie',
//             cookiesToSet.map(({ name, value, options }) =>
//               serializeCookieHeader(name, value, options)
//             )
//           )
//         },
//       },
//     }
//   )

//   return supabase
// }