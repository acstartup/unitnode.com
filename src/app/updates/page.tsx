import { Navbar } from "@/components/navbar";

export default function UpdatesPage() {
  return (
    <div className="relative z-10 min-h-screen bg-white">
      {/* Shared navbar stays consistent across pages */}
      <Navbar />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10">
          UnitNode Updates
        </h1>

        {/* Single update item */}
        <section className="grid grid-cols-1 pt-8 sm:grid-cols-[120px_1fr] gap-6 sm:gap-12">
          {/* Date */}
          <div className="text-sm text-gray-500 sm:text-right pt-2">Aug 1, 2025</div>

          {/* Content */}
          <div>
            {/* Title and excerpt */}
            <h2 className="mt-1 text-xl font-semibold">UnitNode rebuilds in TypeScript</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700 max-w-3xl">
              We rebuilt the UnitNode web app in TypeScript for stronger type safety, faster developer
              iteration, and more reliable product releases. This foundational work sets us up for
              upcoming features across the property management workflow.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


