// src/app/about/page.tsx
"use client";

import AboutContent from "@/app/components/About/AboutContent";
import ContactInfo from "@/app/components/About/ContactInfo";
import FeedbackForm from "@/app/components/About/FeedbackForm";

export default function AboutPage() {
  return (
      <main className="px-4 sm:px-6 md:px-8 py-12 max-w-4xl mx-auto space-y-12">
        {/* Admin-Editable About Section Only */}
        <AboutContent />
        <ContactInfo />
        <FeedbackForm />
      </main>
  );
}
