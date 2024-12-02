"use client";

/* import { useState } from "react"; */
/* import init, { LightClientWorker, WasmLightClient } from 'prism-wasm-lightclient'; */
/* import Image from "next/image"; */

function Hero() {
  /* const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false); */

  /* const startLightClient = async () => {
    try {
      setIsLoading(true);
      await init();
      const channel = new MessageChannel();
      await new LightClientWorker(channel.port1);
      console.log("Worker created");
      await new WasmLightClient(channel.port2);
      console.log("Client created");

      channel.port1.onmessage = (event) => {
        console.log(`1Worker: ${JSON.stringify(event.data)}`);
      };

      channel.port2.onmessage = (event) => {
        console.log(`Worker: ${JSON.stringify(event.data)}`);
      };

      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start light client:", error);
    } finally {
      setIsLoading(false);
    }
  }; */

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <h1 className="text-[15rem] lg:text-[28rem] xl:text-[34rem] max-w-screen-xl w-full text-center font-serif text-gray-900/60 leading-none translate-y-[-15%]">
          prism
        </h1>
      </div>

      <div className="relative space-y-6 px-5 flex flex-col justify-center items-center h-full">
        <h1 className="text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400 font-display text-center">
          Making the internet verifiable, not just secure.
        </h1>
        <div className="flex space-x-1">
          <div className="card-wrapper justify-center h-[40px] w-[110px]">
            <button
              className="card-content rounded-lg card-content
                    border border-white/10 shadow-lg
                    group overflow-hidden transition-all duration-300
                    hover:bg-black hover:scale-105 hover:shadow-xl
                    active:scale-95"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 h-px bg-blue-300/50 blur-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-blue-200/50 blur" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
              <span className="relative text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400">
                Learn More
              </span>
            </button>
          </div>
          <div className="card-wrapper justify-center h-[40px] w-[130px]">
            <button
              onClick={/* startLightClient */ () => console.log("clicked")}
              className="card-content rounded-lg card-content
                      border border-white/10 shadow-lg
                      group overflow-hidden transition-all duration-300
                      hover:bg-black hover:scale-105 hover:shadow-xl
                      active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/5 h-px bg-blue-300/50 blur-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-blue-200/50 blur" />
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />

              {/* {isRunning ? (
                <div className="flex space-x-1">
                  <Image
                    src="/prism_color.svg"
                    alt="Running Prism"
                    width={24}
                    height={24}
                    className="w-6 h-6 animate-prism-sequence"
                  />
                  <span className="pt-0.5 relative text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400">
                    Running...
                  </span>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="animate-pulse">Loading...</div>
                  ) : ( */}
              <span className="relative text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400">
                Run Lightnode
              </span>
              {/* )}
                </>
              )} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
