import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1f2b] text-white py-6 border-t border-gray-700 mt-12">
      <div className="flex flex-col items-center space-y-2">
        <Image
          src="/logo.png"
          alt="Middlebury Lower Tax Alliance Logo"
          width={80}
          height={80}
          className="rounded-sm"
        />
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Middlebury Lower Tax Alliance
        </p>
      </div>
    </footer>
  );
}
