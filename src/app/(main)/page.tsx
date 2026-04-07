import React from "react";
import { Hero } from "@/components/home/hero";

const Home = () => {
  return (
    <main className="flex-1">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif font-bold text-brand-dark mb-8 uppercase tracking-widest text-center underline decoration-brand-primary decoration-double underline-offset-8">
          Our Best Selling Flavors
        </h2>
        <p className="text-muted-foreground italic text-center text-lg mt-8">
          The finest handmade papads of India, coming right after we bake them!
        </p>
      </div>
    </main>
  );
};

export default Home;
