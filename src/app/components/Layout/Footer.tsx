import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1f2b] text-white py-6 border-t border-gray-700">
      <div className="flex justify-center items-center">
        <Image
          src="/logo.png"
          alt="Footer Logo"
          width={100}
          height={100}
          className="rounded-sm"
        />
      </div>
    </footer>
  );
}
