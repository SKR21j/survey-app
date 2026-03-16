export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME ?? 'Survey App'}. All rights
        reserved.
      </div>
    </footer>
  );
}
