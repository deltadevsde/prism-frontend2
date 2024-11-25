"use client";

import React from 'react';

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-12 hover:bg-black/40 transition-all duration-300">
    {icon && (
      <div className="mb-8 inline-block bg-black/20 p-4 rounded-xl border border-white/10">
        {icon}
      </div>
    )}
    <h3 className="text-4xl font-display text-white mb-6">{title}</h3>
    <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
  </div>
);

const WhyPrism = () => {
  return (
    <section id="why" className="w-full px-8 py-32">
      <div className="mx-auto">
        <h2 className="text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400 font-display mb-24 text-left">
          Why prism?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="The Trust Problem"
            description="We browse countless websites and send encrypted messages daily, trusting we're connecting to legitimate sources. But without proper verification, malicious actors can secretly intercept your sensitive data."
          />
          <FeatureCard
            title="Split-World Vulnerability"
            description="This security flaw affects billions of daily internet interactions - from basic web browsing to private messaging - making it one of the most fundamental security challenges of our digital infrastructure."
          />
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  return (
    <section id="how" className="w-full px-8 py-32">
      <div className="mx-auto">
        <h2 className="text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400 font-display mb-24 text-left">
          How Does It Work?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Direct Verification"
            description="To eliminate the need for centralized key directories, Prism cryptographically verifies the identity behind every interaction by posting validity proofs of the key directory and the corresponding roots to a high-throughput, shared data layer as the first based rollup on Celestia."
          />
          <FeatureCard
            title="Trust Minimized"
            description="User applications embed a light node that downloads and verifies this proof directly from the Celestia network, without any intermediaries or RPCs - your app is a node in the network."
          />
          <FeatureCard
            title="Unstoppable PKI"
            description="Prism enables a new generation of applications built on verifiable public key infrastructure. Developers can now create systems where users directly verify cryptographic materials without trusting central authorities. Build authentication that just works—backed by cryptographic proofs, not promises."
          />
        </div>
      </div>
    </section>
  );
};

export { WhyPrism, HowItWorks };