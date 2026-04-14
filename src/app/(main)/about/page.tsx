import React from "react";
import { Sparkles, Code2, ShieldCheck, CreditCard } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Story of Papadwala | Top Traditional Papadwala in Ranchi",
  description:
    "Learn about Papadwala, Ranchi's best traditional papad store. We maintain the legacy of handmade, chemical-free Indian snacks in Jharkhand.",
  keywords: [
    "top traditional papadwala in ranchi",
    "best papad brand ranchi",
    "papadwala story jharkhand",
    "authentic papad near me",
  ],
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Papadwala Ranchi",
    "description": "Learn about Papadwala, Ranchi's best traditional papad store. We maintain the legacy of handmade, chemical-free Indian snacks in Jharkhand.",
    "publisher": {
      "@type": "Organization",
      "name": "Papadwala Ranchi"
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCF8] px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className="mx-auto max-w-4xl">
        <header className="mb-16 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-100/50 backdrop-blur-sm rounded-full border border-amber-200/50">
            <Sparkles size={12} className="text-amber-600" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-amber-800">
              Project Disclaimer
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-brand-dark text-balance">
            The Story Behind{" "}
            <span className="text-brand-primary italic">Papadwala</span>
          </h1>
        </header>

        {/* Global Notice Alert */}
        <div className="mb-16 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/30 p-8 sm:p-10 text-center shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
            <Code2 size={150} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-brand-dark tracking-tight mb-4 text-balance">
            This is not a real business.
          </h2>
          <p className="text-brand-dark/70 text-[16px] leading-relaxed max-w-2xl mx-auto">
            This entire application serves as a high-fidelity template for a
            modern, full-stack e-commerce system built for a local heritage
            business. It showcases production-level architecture designed to
            demonstrate advanced web technologies interfacing together.
          </p>
        </div>

        {/* System Features */}
        <h3 className="font-serif text-2xl font-normal text-brand-dark tracking-tight mb-8 text-center">
          What powers this platform?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="rounded-[2rem] bg-white border border-brand-dark/10 p-8 shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
              <ShieldCheck className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-xl font-medium text-brand-dark mb-3">
              Full Admin Dashboard
            </h4>
            <p className="text-brand-dark/60 text-[14px] leading-relaxed">
              Equipped with a secure role-based administration panel to actively
              manage products, monitor inventory, update variants, and track
              order fulfillment stages securely.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-[2rem] bg-white border border-brand-dark/10 p-8 shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
              <CreditCard className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-xl font-medium text-brand-dark mb-3">
              Integrated Payment Gateway
            </h4>
            <p className="text-brand-dark/60 text-[14px] leading-relaxed">
              Demonstrates a fully implemented PhonePe payment gateway flow for
              simulated financial transactions, securely handling checkouts
              through OAuth architecture.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-[2rem] bg-white border border-brand-dark/10 p-8 shadow-sm transition-all hover:shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6">
              <Code2 className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h4 className="font-serif text-xl font-medium text-brand-dark mb-3">
              Server-Side Performance
            </h4>
            <p className="text-brand-dark/60 text-[14px] leading-relaxed">
              Built on Next.js leveraging robust Server Actions, Tanstack React
              Query infinite data hydration, and dynamic server-side Postgres
              filtering architectures using Drizzle ORM.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-[2rem] bg-brand-dark p-8 shadow-sm transition-all hover:shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-brand-primary mb-6 backdrop-blur-md">
                <Sparkles className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h4 className="font-serif text-xl font-medium text-white mb-3">
                Heritage Premium UI
              </h4>
              <p className="text-white/60 text-[14px] leading-relaxed">
                Featuring a bespoke design aesthetic built on standard Tailwind
                definitions without relying on heavy pre-packaged components.
                Framer Motion physics power beautiful user micro-interactions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-brand-dark/10 pt-10 text-center">
          <p className="font-serif text-lg italic text-brand-dark/50">
            &quot;Crafting authentic digital experiences, just like our
            handcrafted papads.&quot;
          </p>
        </div>
      </div>
    </main>
  );
}
