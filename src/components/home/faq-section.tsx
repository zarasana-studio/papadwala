"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as motion from "motion/react-client";
import { FaQuestion } from "react-icons/fa";

const faqs = [
  {
    question: "How are your papads made differently?",
    answer:
      "Unlike mass-produced brands, our papads are hand-rolled in small batches by community artisans. We use sun-drying techniques instead of industrial ovens to preserve the natural oils and heritage spice notes.",
  },
  {
    question: "Do you use any preservatives?",
    answer:
      "None. We believe in 100% natural shelf-stability achieved through traditional drying methods and pure, organic spice blends. No chemicals, no artificial colors.",
  },
  {
    question: "How should I store them?",
    answer:
      "Store them in an airtight container in a cool, dry place. If they lose their crispness due to humidity, a few minutes under direct sunlight or a quick heat-up will restore their perfect crunch.",
  },
  {
    question: "Are they suitable for vegans?",
    answer:
      "Yes! Most of our traditional varieties are entirely plant-based and vegan-friendly, made with pulses and authentic Indian spices.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 sm:py-32 mask-y-from-95% bg-amber-200/10 relative ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      <div
        className={cn(
          "absolute inset-0 z-0",
          "bg-size-[20px_20px] opacity-50",
          "bg-[radial-gradient(var(--color-amber-500)_1px,transparent_1px)]",
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-amber-50 mask-[radial-gradient(ellipse_at_center,black_50%,white_10%,transparent_80%)]"></div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-1 relative">
        <div className="text-center flex flex-col items-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 backdrop-blur-sm rounded-full border border-brand-primary/30 group cursor-default w-fit"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-dark/80">
              Any Doubts
            </span>
            <FaQuestion
              size={10}
              className="text-amber-600 transition-transform duration-500 group-hover:rotate-12"
            />
          </motion.div>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Your Questions, <span className="text-brand-primary">Answered</span>
            .
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-none bg-white/40 rounded-[1.25rem] sm:rounded-[1.5rem] px-5 sm:px-8 transition-all hover:bg-white/50"
              >
                <AccordionTrigger className="text-sm font-medium text-slate-900 py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[13px] font-medium leading-relaxed text-slate-500 pb-6 pr-12">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
