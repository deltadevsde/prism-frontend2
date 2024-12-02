"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-black/30 px-6 pt-16 pb-4 mt-20">
      <div className="max-w-[1400px] flex mx-auto justify-center">
        <div className="flex space-x-60 items-start">
          <div className="flex items-center gap-3">
            <Image 
              width={56} 
              height={56} 
              src="/prism_color.svg" 
              alt="prism logo" 
            />
            <span className="text-white font-serif text-4xl">prism</span>
          </div>

          <div>
		  	<h3 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-400 font-medium text-lg mb-4">
				Socials
			</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  X
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Discord
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Github
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  YouTube
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitch
                </Link>
              </li>
            </ul>
          </div>

          <div>
		  	<h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 font-medium text-lg mb-4">
				Links
			</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Prism Quickstart
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
        <div className="mt-16 text-gray-400 text-sm">
          © 2024, Prism Inc - All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;