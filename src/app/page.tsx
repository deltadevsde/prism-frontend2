import Image from "next/image";

function Hero() {
  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400 font-display">
        Making the internet verifiable, not just secure.
      </h1>
      <div className="relative">
        <button
          className="relative px-8 py-4 bg-black/10 backdrop-blur-sm rounded-xl
                     border border-white/10 shadow-lg
                     group overflow-hidden transition-all duration-300
                     hover:bg-black/20 hover:scale-105 hover:shadow-xl
                     active:scale-95"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 h-px bg-blue-300/50 blur-sm" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-blue-200/50 blur" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
          />

          <span className="relative text-2xl font-light tracking-wide">
            <span className="text-white">Learn</span>
            <span className="text-blue-300 ml-2">More</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <div className=" absolute top-6">
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
    <main className="flex items-center flex-col justify-center h-screen bg-gray-900 text-center">
      <TopNav />
      <Hero />
      {/* Why Prism? */}
      <div>
        <h1> Why Prism? </h1>
      </div>
      {/* How does it work? */}
      <div>
        <h1> How does it work? </h1>
      </div>
      {/* Footer */}
      <div></div>
    </main>
  );
}
