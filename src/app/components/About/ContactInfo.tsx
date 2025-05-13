"use client";

export default function ContactInfo() {
  return (
    <section className="bg-[#2c3545] border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto mb-8 shadow-md">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Contact Us</h2>
      <ul className="text-gray-400 space-y-1">
        <li>
          <span className="font-semibold text-white">Email:</span>{" "}
          info@middleburyhub.org
        </li>
        <li>
          <span className="font-semibold text-white">Phone:</span> (555)
          123-4567
        </li>
        <li>
          <span className="font-semibold text-white">Address:</span> 123 Main
          Street, Middlebury, CT
        </li>
      </ul>
    </section>
  );
}
