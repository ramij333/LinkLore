import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-6 py-16 bg-gradient-to-b from-white to-blue-50 text-center">
      <div className="max-w-3xl space-y-10">
        <h1 className="text-6xl font-extrabold text-gray-900 drop-shadow-md">
          Welcome to <span className="text-blue-600">LinkSaver</span>
        </h1>

        <p className="text-gray-700 text-xl leading-relaxed max-w-xl mx-auto">
          <strong>LinkSaver</strong> helps you effortlessly save, organize, and manage all your 
          favorite links from around the web. Whether it’s articles, tutorials, or inspiration, 
          keep everything at your fingertips with a clean and intuitive interface.
        </p>

        <section className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-200 max-w-xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Features</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800 text-lg">
            <li>🔖 Save and categorize links easily with tags and notes.</li>
            <li>🔍 Powerful search and filter capabilities to find your bookmarks fast.</li>
            <li>📂 Organize bookmarks into collections and sections for better management.</li>
            <li>🌗 Toggle between light and dark modes for comfortable viewing.</li>
            <li>🔐 Secure user authentication powered by Supabase for your peace of mind.</li>
            <li>⚡ Lightning-fast, responsive design optimized for all devices.</li>
          </ul>
        </section>

        <div className="flex flex-wrap justify-center gap-6 pt-8">
          <Link
            href="/auth/login"
            className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white rounded-lg shadow-xl group bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full opacity-30 group-hover:w-56 group-hover:h-56"></span>
            <span className="relative">Log In</span>
          </Link>

          <Link
            href="/auth/signup"
            className="relative inline-flex items-center justify-center px-8 py-3 font-medium text-blue-600 border-2 border-blue-600 rounded-lg shadow-md group hover:text-white hover:bg-blue-600 transition"
          >
            <span className="absolute inset-0 bg-blue-600 rounded-lg scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            <span className="relative">Sign Up</span>
          </Link>

          <Link
            href="/bookmarks"
            className="relative inline-flex items-center justify-center px-8 py-3 font-medium text-gray-700 border-2 border-gray-300 rounded-lg shadow-sm group hover:text-white hover:bg-gray-700 transition"
          >
            <span className="absolute inset-0 bg-gray-700 rounded-lg scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
            <span className="relative">View Bookmarks</span>
          </Link>
        </div>

        <footer className="pt-12 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} LinkSaver. All rights reserved.
        </footer>
      </div>
    </main>
  );
}




