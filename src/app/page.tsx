// app/page.tsx
"use client";

import AboutContent from "./components/About/AboutContent";
import ContactInfo from "./components/About/ContactInfo";
import FeedbackForm from "./components/About/FeedbackForm";

export default function Page() {
    return (
        <main className="space-y-8 px-4 sm:px-6 py-12 max-w-4xl mx-auto">
            <AboutContent />
            <ContactInfo />
            <FeedbackForm />
        </main>
    );
}
