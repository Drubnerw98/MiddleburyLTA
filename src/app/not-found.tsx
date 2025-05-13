import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20">
      <Image
        src="/logo.png"
        alt="Middlebury Info Hub logo"
        width={140}
        height={140}
        className="rounded-md mb-6"
        priority
      />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">Sorry, we couldn’t find that page.</p>
      <Link
        href="/"
        className="text-blue-600 hover:underline font-medium text-lg"
      >
        ← Return Home
      </Link>
    </div>
  );
}
