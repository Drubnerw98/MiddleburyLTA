import Link from "next/link";

export default function TaxImpactCTA() {
  return (
      <div className="bg-[#2c3545]/90 border border-white/10 shadow-md hover:shadow-xl hover:border-blue-500/30 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05)] rounded-lg p-6 backdrop-blur transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] max-w-3xl w-full mx-auto">
        <div className="flex flex-col items-center text-center space-y-3">
          <h2 className="text-lg font-semibold text-yellow-300 font-serif">
            Curious about your taxes?
          </h2>

          <Link href="/tax-impact">
            <button className="bg-blue-800/70 backdrop-blur-md hover:bg-blue-700/80 text-white font-medium py-3 px-6 rounded-lg shadow-md transition duration-200 border border-blue-600 hover:shadow-[0_0_10px_2px_rgba(59,130,246,0.7)]">
              Explore the Tax Impact
            </button>
          </Link>

          <p className="text-sm text-blue-300 italic">
            Try the interactive tool to see how your taxes could change.
          </p>
        </div>
      </div>
  );
}
