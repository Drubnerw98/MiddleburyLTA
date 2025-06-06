// src/app/about/page.tsx
"use client";

import AboutContent from "@/app/components/About/AboutContent";
import ContactInfo from "@/app/components/About/ContactInfo";
import FeedbackForm from "@/app/components/About/FeedbackForm";

export default function AboutPage() {
  return (
      <main className="px-4 sm:px-6 md:px-8 py-12 max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="bg-[#2c3545]/90 border border-white/10 backdrop-blur rounded-xl shadow-md p-6 space-y-5">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-blue-300 tracking-tight">
            About the Project
          </h1>

          <p className="text-gray-300 leading-relaxed">
            This site was created to help inform and unify residents around
            important developments in Middlebury, CT. It serves as a
            community-driven hub where locals can share updates, facts, and
            perspectives on issues affecting the town.
          </p>

          <p className="text-gray-300 leading-relaxed">
            A major concern on the horizon is Middlebury’s next property
            revaluation, which could drastically increase the tax burden on
            homeowners. Without responsible business development and a growing
            Grand List, residents may face steeper taxes, lower home values, and
            financial strain.
          </p>

          <p className="text-gray-300 leading-relaxed">
            Middlebury Taxpayers is committed to promoting smart growth,
            transparency, and local accountability — not costly lawsuits or legal
            battles. We believe Middlebury’s future lies in cooperation, not
            confrontation.
          </p>

          <p className="text-sm text-gray-500 pt-2 border-t border-white/10">
            Content on this site is user-submitted and moderated. If you'd like to
            help contribute or suggest improvements, reach out to the site
            administrator.
          </p>
        </section>

        {/* Modular Components */}
        <AboutContent />
        <ContactInfo />
        <FeedbackForm />
      </main>
  );
}
