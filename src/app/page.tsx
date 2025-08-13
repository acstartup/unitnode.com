import { Navbar } from "@/components/navbar";
import { TypingAnimation } from "@/components/typing-animation";
import { AutoLoginOpener } from "@/components/auto-login-opener";
import { ImageBackground } from "@/components/image-background";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative z-10 min-h-screen overflow-visible">
      <ImageBackground />
      {/* 
        Container options:
        - Current: h-screen overflow-hidden (prevents scrolling)
        - For scrolling: min-h-screen (allows content to extend page)
        - Additional options: pb-10 px-4 (padding bottom and horizontal)
      */}
      <Navbar />
      <AutoLoginOpener />
      
      {/* Hero section with typing animation */}
      {/* 
        Margin lines (commented out):
        - Use these classes to add margin if scrolling is re-enabled
        - mt-16: Top margin
        - mb-20: Bottom margin
        - py-10: Vertical padding
      */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-40px)]">
        <div className="flex items-center gap-1.5 mb-6 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs border border-white/40 shadow-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
          UnitNode launching MVP soon...
        </div>
        <TypingAnimation 
          text="Property management on autopilot."
          className="text-white text-4xl md:text-4xl lg:text-6xl font-bold tracking-tight text-center drop-shadow"
          speed={40}
          cursorHeight="h-12"
        />
        <p className="text-white text-sm md:text-base max-w-2xl mx-auto text-center mt-6 drop-shadow font-semibold">
          UnitNode is a property management software that automates entire workflows—from importing water-bills to notifying tenants in their preferred language.
        </p>
      </section>

      {/* Footer spacer to ensure it’s visible over fixed backgrounds */}
      <div className="h-10" />
      <Footer />
    </div>
  );
}