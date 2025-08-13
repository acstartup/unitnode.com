import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";

export default function UpdatesPage() {
  return (
    <div className="relative z-10 min-h-screen bg-white">
      {/* Solid white background */}
      <div className="fixed inset-0 bg-white z-0" />

      {/* Plain header (no rounded rectangle) */}
      <header className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="UnitNode">
            <Image src="/unitnode-full.svg" alt="UnitNode" width={130} height={28} className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="#" className="text-sm text-gray-700 hover:text-black">Login</Link>
            <Button variant="secondary" size="sm" className="py-1 px-3 font-extrabold text-sm">
              Sign up
            </Button>
            <Link href="/" aria-label="Close and return to homepage" className="p-2 rounded-full hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
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


