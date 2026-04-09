"use client";

import * as motion from "motion/react-client";
import { ShieldCheck, History, Hammer, Leaf } from "lucide-react";

const features = [
  {
    title: "Uncompromising Quality",
    desc: "Every batch is tested for consistency in crispiness, taste, and texture.",
    icon: ShieldCheck,
    color: "bg-sky-50",
    iconColor: "text-sky-600",
    size: "col-span-1 md:col-span-2",
  },
  {
    title: "Deeply Traditional",
    desc: "Recipes passed down through centuries, preserved in every bite.",
    icon: History,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    size: "col-span-1",
  },
  {
    title: "Small Batch Handmade",
    desc: "No massive machines. Just skilled artisans hand-rolling every single papad.",
    icon: Hammer,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
    size: "col-span-1",
  },
  {
    title: "100% Organic & Pure",
    desc: "Zero preservatives, zero chemicals. Only nature's finest ingredients.",
    icon: Leaf,
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    size: "col-span-1 md:col-span-2",
  },
];

export function BentoFeatures() {
  return (
    <section className="bg-slate-50/50 py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-start space-y-4 mb-16">
          <p className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-orange-600">
            Why Papadwala?
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Rooted in Tradition, <br /> Crafted for the Modern Table.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                rotateX: -2,
                rotateY: 2,
                z: 20
              }}
              className={`${feature.color} ${feature.size} group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 perspective-1000`}
            >
              {/* Abstract Isometric SVG Graphic */}
              <div className="absolute -right-8 -top-8 h-40 w-40 opacity-[0.03] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12">
                <feature.icon className="h-full w-full" />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between space-y-12">
                <div className={`${feature.iconColor} bg-white/60 backdrop-blur-md h-12 w-12 rounded-[1rem] flex items-center justify-center shadow-sm shadow-slate-200/50 transition-transform duration-500 group-hover:-translate-y-1`}>
                  <feature.icon size={24} />
                </div>
                
                <div>
                  <h3 className="font-serif text-2xl font-medium text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] font-medium leading-relaxed text-slate-600 max-w-xs">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
