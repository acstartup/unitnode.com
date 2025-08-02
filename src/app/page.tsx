import { Navbar } from "@/components/navbar";
import { TypingAnimation } from "@/components/typing-animation";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero section with typing animation */}
      <section className="flex flex-col items-center justify-center h-[60vh] mt-16">
        <div className="flex items-center gap-1.5 mb-6 px-3 py-1 bg-gray-50 rounded-full text-gray-800 text-xs border border-gray-300 shadow-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          UnitNode launching MVP soon...
        </div>
        <TypingAnimation 
          text="Property management on autopilot"
          className="text-4xl md:text-4xl lg:text-6xl font-bold tracking-tight text-center"
          speed={40}
          cursorHeight="h-12"
        />
      </section>
    </div>
  );
}