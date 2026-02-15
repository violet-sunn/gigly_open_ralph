import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">Gigly</h1>
        <p className="text-lg text-gray-600">Your events, simplified.</p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Get Started
        </Link>
      </main>
    </div>
  )
}
