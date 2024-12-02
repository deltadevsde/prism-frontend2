import Image from "next/image";
import MouseFollower from "./components/MouseFollower";
import { HowItWorks, WhyPrism } from "./components/GridComponents";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
//import Chat from "./components/Chat";

function TopNav() {
  return (
    <div className="absolute top-6">
      {/* Bottom highlight effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-blue-300/20 blur-sm" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-blue-200/20 blur" />

      {/* Main header container */}
      <nav
        className="relative px-6 py-2 bg-black/40 backdrop-blur-sm rounded-2xl
                    border border-white/10 shadow-lg"
      >
        <div className="flex items-center gap-12">
          {/* Logo section */}
          <div className="flex items-center gap-3">
            <Image
              width={"32"}
              height={"32"}
              src="/prism_color.svg"
              alt="prism logo"
            />
          </div>

          {/* Navigation links */}
          <div className="flex items-center gap-12">
            <a
              href="#why"
              className="text-gray-400 text-sm font-medium hover:text-white transition-colors"
            >
              Why Prism?
            </a>
            <a
              href="#how"
              className="text-gray-400 text-sm font-medium hover:text-white transition-colors"
            >
              How Does It Work?
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <MouseFollower />
      <div className="relative">
        <div className="flex items-center justify-center">
          <TopNav />
        </div>
        <div className="h-screen flex items-center justify-center">
          <Hero />
        </div>
        <WhyPrism />
        <HowItWorks />
      </div>
      {/* <Chat /> */}
      <Footer />
    </main>
  );
}
