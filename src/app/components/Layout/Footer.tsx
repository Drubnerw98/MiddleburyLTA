import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1f2b]/80 backdrop-blur border-t border-white/10 py-8 mt-12">
      <div className="flex flex-col items-center space-y-3">
        <Image
          src="/logo.png"
          alt="Middlebury Lower Tax Alliance Logo"
          width={72}
          height={72}
          className="rounded-sm"
        />
        <p className="text-sm text-gray-400 tracking-tight">
          © {new Date().getFullYear()} Middlebury Lower Tax Alliance
        </p>
      </div>
    </footer>
  );
}
