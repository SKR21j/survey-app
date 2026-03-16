import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-8xl font-bold text-indigo-200">404</div>
      <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="text-gray-500 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
