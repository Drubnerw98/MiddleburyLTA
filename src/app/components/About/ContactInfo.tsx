// src/app/components/About/ContactInfo.tsx
"use client";

export default function ContactInfo() {
  return (
      <section className="bg-[#2c3545] border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto mb-8 shadow-md">
        <h2 className="text-xl font-bold text-blue-400 mb-4">Contact Us</h2>
        <ul className="text-gray-400 space-y-1">
          <li>
            <span className="font-semibold text-white">Email:</span>{" "}
            press@middleburytaxpayers.org
          </li>
          <li>
            <span className="font-semibold text-white">Phone:</span>{" "}
            (802) 555-1234
          </li>
          <li>
            <span className="font-semibold text-white">Website:</span>{" "}
            www.middleburytaxpayers.org
          </li>
        </ul>
      </section>
  );
}
