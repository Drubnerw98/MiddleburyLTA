// src/app/components/About/ContactInfo.tsx
"use client";

export default function ContactInfo() {
    return (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
            <div className="bg-[#2c3545]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-yellow-300">Contact Us</h2>

                <ul className="space-y-2 text-gray-300 text-sm">
                    <li>
                        <span className="font-semibold text-white">Email:</span>{" "}
                        <a
                            href="mailto:press@middleburytaxpayers.org"
                            className="text-blue-400 hover:underline"
                        >
                            press@middleburytaxpayers.org
                        </a>
                    </li>
                    <li>
                        <span className="font-semibold text-white">Phone:</span>{" "}
                        (802) 555-1234
                    </li>
                    <li>
                        <span className="font-semibold text-white">Website:</span>{" "}
                        <a
                            href="https://www.middleburytaxpayers.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                        >
                            www.middleburytaxpayers.org
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
}
