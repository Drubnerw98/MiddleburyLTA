// src/app/about/page.tsx
"use client";

import AboutContent from "@/app/components/About/AboutContent";
import ContactInfo from "@/app/components/About/ContactInfo";
import FeedbackForm from "@/app/components/About/FeedbackForm";

export default function AboutPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto space-y-10">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">About the Project</h1>

        <p className="mb-4">
          This site was created to help inform and unify residents around
          important developments in Middlebury, CT. It serves as a
          community-driven hub where locals can share updates, facts, and
          perspectives on issues affecting the town.
        </p>

        <p className="mb-4">
          One of the current topics is the proposed transformation of the old
          Timex building into a new distribution facility. The project backers
          believe this will create jobs, generate local revenue, and lower the
          tax burden for residents.
        </p>

        <p className="mb-4">
          While community opinions may differ, our goal is to foster a space for
          factual, respectful discussion. This site is not affiliated with any
          official entity, but aims to provide tools and transparency for all
          sides to participate productively.
        </p>

        <p className="text-sm text-gray-500">
          Content on this site is user-submitted and moderated. If you'd like to
          help contribute or suggest improvements, reach out to the site
          administrator.
        </p>
      </section>

      <AboutContent />
      <ContactInfo />
      <FeedbackForm />
    </main>
  );
}
