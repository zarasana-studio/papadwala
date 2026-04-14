import * as motion from "motion/react-client";
import { Sparkles } from "lucide-react";
import {
  SvgHandmade,
  SvgOrganic,
  SvgQuality,
  SvgTraditional,
} from "@/SVGs/BentoGrid";

const features = [
  {
    title: "Uncompromising Quality",
    desc: "Every batch is tested for consistency in crispiness, taste, and texture.",

    Graphic: SvgQuality,
    gradient: "bg-gradient-to-br from-white/30 to-orange-100/50",
    iconColor: "text-orange-700",
    size: "col-span-1 md:col-span-2",
  },
  {
    title: "Deeply Traditional",
    desc: "Recipes passed down through centuries, preserved in every bite.",

    Graphic: SvgTraditional,
    gradient: "bg-gradient-to-br from-[#f8f5f2] to-amber-100/40",
    iconColor: "text-amber-700",
    size: "col-span-1",
  },
  {
    title: "Small Batch Handmade",
    desc: "No massive machines. Just skilled artisans hand-rolling every single papad.",

    Graphic: SvgHandmade,
    gradient: "bg-gradient-to-tr from-orange-50 to-amber-50/80",
    iconColor: "text-orange-600",
    size: "col-span-1",
  },
  {
    title: "100% Organic & Pure",
    desc: "Zero preservatives, zero chemicals. Only nature's finest ingredients.",

    Graphic: SvgOrganic,
    gradient: "bg-gradient-to-tl from-emerald-50/80 to-teal-50/40",
    iconColor: "text-emerald-700",
    size: "col-span-1 md:col-span-2",
  },
];

export function BentoFeatures() {
  return (
    <section className="py-24 sm:py-32 mask-y-from-95%  relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 backdrop-blur-sm rounded-full border border-brand-primary/30 group cursor-default"
          >
            <Sparkles
              size={10}
              className="text-amber-600 transition-transform duration-500 group-hover:rotate-12"
            />
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-dark/80">
              Why Ranchi's Papadwala?
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-brand-dark"
          >
            Ranchi's timeless taste.{" "}
            <span className="text-brand-primary">Modern crunch.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: idx * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${feature.gradient} ${feature.size} group relative flex flex-col justify-between rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 shadow shadow-amber-800/20`}
            >
              {/* Graphic Background Area */}
              <div className="absolute z-0 pointer-events-none transition-transform duration-700 ease-[0.22,1,0.36,1] h-full inset-y-0 right-0 w-32">
                <feature.Graphic />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between space-y-24 md:space-y-12">
                <div className="max-w-xs md:max-w-sm">
                  <h3 className="font-serif text-2xl font-medium text-brand-dark mb-3 tracking-tight transition-colors duration-300 group-hover:text-amber-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-normal leading-relaxed text-brand-dark/70 transition-colors duration-300 group-hover:text-brand-dark text-balance">
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
