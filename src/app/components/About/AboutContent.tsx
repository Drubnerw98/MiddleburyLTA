"use client";

export default function AboutContent() {
  return (
    <section className="bg-[#2c3545] border border-gray-700 rounded-lg p-6 max-w-3xl mx-auto mb-8 shadow-md">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        About Middlebury Lower Tax Alliance
      </h1>
      <p className="text-gray-300 leading-relaxed mb-6">
        The Middlebury Info Hub is a community-driven platform designed to keep
        residents informed, engaged, and connected. Whether it's development
        plans, town events, or public discussions, we aim to provide a space for
        transparency and participation.
      </p>
      <img
        src="https://source.unsplash.com/random/800x200/?community"
        alt="Middlebury Community"
        className="w-full h-auto rounded-lg border border-gray-600 shadow-sm"
      />
    </section>
  );
}
