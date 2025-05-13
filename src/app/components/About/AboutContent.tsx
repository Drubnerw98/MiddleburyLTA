// src/app/components/About/AboutContent.tsx
"use client";

export default function AboutContent() {
  return (
    <section className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        About Middlebury Lower Tax Alliance
      </h1>
      <p className="text-gray-300 mb-4">
        The Middlebury Info Hub is a community-driven platform designed to keep
        residents informed, engaged, and connected. Whether it's development
        plans, town events, or public discussions, we aim to provide a space for
        transparency and participation.
      </p>
      <img
        src="https://source.unsplash.com/random/800x200/?community"
        alt="Middlebury Community"
        className="rounded shadow-md"
      />
    </section>
  );
}
