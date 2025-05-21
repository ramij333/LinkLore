

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 gap-8 text-center">
      <h1 className="text-4xl font-bold">Welcome to Your App</h1>
      <p className="max-w-md text-gray-600">
        This is a simple starter home page. Use the links below to login or create an account.
      </p>

      <div className="flex gap-6">
        <a
          href="/auth/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Log In
        </a>
        <a
          href="/auth/signup"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
        >
          Sign Up
        </a>
      </div>
    </div>
  )
}


