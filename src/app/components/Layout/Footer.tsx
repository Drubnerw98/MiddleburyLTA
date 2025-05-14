import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full relative z-10 border-t border-white/10 bg-[#1a1f2b]/80 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-16">
      <div className="flex flex-col items-center py-8 px-4 space-y-3 text-sm text-gray-400">
        <Image
          src="/logo.png"
          alt="Middlebury Lower Tax Alliance Logo"
          width={64}
          height={64}
          className="rounded-sm opacity-80"
        />
        <p className="text-xs tracking-wide">
          © {new Date().getFullYear()} Middlebury Lower Tax Alliance
        </p>
      </div>

      {/* Vignette at bottom of page */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[-1]" />
    </footer>
  );
}
