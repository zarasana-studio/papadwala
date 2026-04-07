import { CookingPot, Home, Leaf, Sparkles } from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex h-screen w-full overflow-hidden bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-brand-dark)_18%,transparent)_1px,transparent_1px),linear-gradient(to_top_right,color-mix(in_oklch,var(--color-brand-primary)_10%,transparent),color-mix(in_oklch,var(--color-brand-accent)_30%,transparent))] bg-size-[20px_20px,100%_100%]">
        {/* Left: Full-height image panel */}
        <section className="relative hidden w-3/5 p-3 lg:block">
          <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
            <Image
              src="/PapadImage1.jpeg"
              alt="Handcrafted Papadwala Papads"
              className="h-full w-full object-cover"
              priority
              height={1920}
              width={1080}
            />

            <div className="absolute inset-0 bg-linear-to-br from-black/70 via-brand-dark/55 to-amber-900/45" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,201,122,0.35),transparent_38%),radial-gradient(circle_at_85%_78%,rgba(255,109,52,0.28),transparent_30%)]" />

            <div className="absolute inset-x-10 top-9 z-20 flex items-center justify-between">
              <div className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 backdrop-blur-xl">
                <p className="font-serif text-[0.65rem] tracking-[0.32em] text-amber-100/90">
                  PAPADWALA HOUSE
                </p>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full border border-orange-100/30 bg-orange-500/80 px-5 py-2 text-sm font-medium text-white backdrop-blur-xl transition-colors duration-200 hover:bg-orange-500"
              >
                <Home size={14} />
                <span>Back Home</span>
              </Link>
            </div>

            <div className="absolute left-12 top-[19%] z-20 max-w-xl">
              <p className="font-serif text-xs tracking-[0.28em] text-amber-100/85">
                ARTISAN CRAFTED SINCE 1987
              </p>
              <h1 className="mt-5 font-serif text-[3.4rem] leading-[1.03] text-orange-50 sm:text-[4rem]">
                Experience the,
                <br />
                <span className="text-orange-200">Traditional</span> Taste.
              </h1>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-orange-100/85">
                Curated small-batch papads with heritage spice notes, clean
                ingredients, and a finish made for modern gourmet tables.
              </p>
            </div>

            <div className="absolute right-10 top-[24%] z-20 w-56 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-2xl">
              <p className="text-[0.62rem] tracking-[0.22em] text-orange-100/70">
                TODAY'S HIGHLIGHT
              </p>
              <p className="mt-3 font-serif text-2xl text-orange-50">
                Royal Lehsun
              </p>
              <p className="mt-2 text-sm leading-relaxed text-orange-100/80">
                Smoky garlic layers with toasted urad depth and a crisp, clean
                bite.
              </p>
            </div>

            <div className="absolute inset-x-10 bottom-10 z-20 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/12 px-5 py-2 text-sm text-orange-50 backdrop-blur-xl">
                <CookingPot size={15} className="text-amber-200" />
                <span className="font-medium">Hand Rolled Daily</span>
              </span>
              <span className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/12 px-5 py-2 text-sm text-orange-50 backdrop-blur-xl">
                <Leaf size={15} className="text-emerald-300" />
                <span className="font-medium">Clean Ingredients</span>
              </span>
              <span className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/12 px-5 py-2 text-sm text-orange-50 backdrop-blur-xl">
                <Sparkles size={15} className="text-orange-200" />
                <span className="font-medium">Chef-Loved Flavor</span>
              </span>
            </div>
          </div>
        </section>

        {/* Right: Auth form panel */}
        <section className="flex w-full flex-col items-center justify-center px-6 lg:w-2/5">
          {children}
        </section>
      </main>
    </>
  );
};

export default AuthLayout;
