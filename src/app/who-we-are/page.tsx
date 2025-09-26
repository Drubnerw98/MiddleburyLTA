// app/who-we-are/page.tsx
import Image from "next/image";

export const metadata = {
    title: "Who are we? | Middlebury Taxpayers",
    description:
        "Learn who we are and why we’re advocating for responsible commercial development to protect Middlebury homeowners.",
};

export default function WhoWeArePage() {
    return (
        <main className="min-h-[calc(100vh-80px)]">
            {/* Top banner */}
            <section className="relative h-[36vh] min-h-[260px] w-full overflow-hidden">
                <Image
                    src="/images/townhall-middlebury.jpg"
                    alt="Middlebury Town Hall"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                        <h1 className="text-white text-3xl sm:text-4xl font-bold">
                            Who are we?
                        </h1>
                    </div>
                </div>
            </section>

            {/* Body */}
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
                <div className="space-y-8 text-[15px] leading-relaxed text-gray-900">
                    <p>
                        Property owners who are concerned with the impact on taxes in
                        Middlebury without new commercial development. Residential taxpayers
                        will bear almost all of the tax increases due to the rising costs of
                        schools and services in the town of Middlebury.
                    </p>

                    <section>
                        <h2 className="text-xl font-semibold">David &amp; Norman Drubner</h2>
                        <p className="mt-2">
                            David Drubner who was born and raised in Middlebury, CT in 1963
                            and lived at 28 Northwood Drive until after college, will be the
                            spokesperson for this group. Norman Drubner has lived in
                            Middlebury off and on from 1963 owning homes on Northwood Drive,
                            South Street, Bristol Road and West Lake Road. Norman Drubner and
                            the Drubner family have responsibly owned and developed numerous
                            properties in Middlebury during that time period. Those
                            properties have included 444 Middlebury Road, The Middlebury
                            Hamlet Plaza, Turnpike Office Park, 1000 Southford Road, 1001
                            Southford Road, 764 Southford Road (which they have owned since
                            1998), 10 N. Benson Road, 100 N. Benson Road as well as other
                            properties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Olymbec</h2>
                        <p className="mt-2">
                            Olymbec owns and manages a diverse portfolio of industrial,
                            office, retail, and residential properties located throughout
                            Canada and the United States. Headquartered in Montréal, Olymbec
                            is now one of the largest private industrial real estate holders
                            in Eastern Canada with branch offices located in key markets
                            across Québec and the United States including; Trois-Rivières,
                            Sherbrooke, Québec City, Dallas, Columbus, Atlanta, Las Vegas, St.
                            Louis, Memphis, Hartford, Indianapolis, Philadelphia and West
                            Virginia. Olymbec owns 199 Benson Road (the former Crompton &amp;
                            Chemtura facility) and the former Pilots Mall Property which
                            includes land in both Middlebury, Oxford and Southbury
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Murtha Enterprises / Route 188 LLC</h2>
                        <p className="mt-2">
                            Murtha Enterprises own and manages industrial properties in Beacon
                            Falls and their entity Route 188 LLC owns 671 Southford Road a
                            large LI-200 development site in Middlebury on Southford and
                            Christian Roads.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold">Middlebury Land Development LLC</h2>
                        <p className="mt-2">
                            Middlebury Land Development LLC owns numerous residential and
                            commercial properties in Middlebury and has been a landowner in
                            Middlebury since at least 1969.
                        </p>
                    </section>

                    <p className="font-semibold">
                        Collectively these groups are the biggest taxpayers in Middlebury,
                        CT
                    </p>
                </div>
            </section>
        </main>
    );
}
