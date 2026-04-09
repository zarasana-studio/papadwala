"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as motion from "motion/react-client";

const faqs = [
  {
    question: "How are your papads made differently?",
    answer: "Unlike mass-produced brands, our papads are hand-rolled in small batches by community artisans. We use sun-drying techniques instead of industrial ovens to preserve the natural oils and heritage spice notes.",
  },
  {
    question: "Do you use any preservatives?",
    answer: "None. We believe in 100% natural shelf-stability achieved through traditional drying methods and pure, organic spice blends. No chemicals, no artificial colors.",
  },
  {
    question: "How should I store them?",
    answer: "Store them in an airtight container in a cool, dry place. If they lose their crispness due to humidity, a few minutes under direct sunlight or a quick heat-up will restore their perfect crunch.",
  },
  {
    question: "Are they suitable for vegans?",
    answer: "Yes! Most of our traditional varieties are entirely plant-based and vegan-friendly, made with pulses and authentic Indian spices.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-white py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20">
          <p className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-orange-600">
            F.A.Q
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
            Curiosities & Answers
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
                className="border-none bg-slate-50/50 rounded-[1.5rem] px-8 transition-all hover:bg-slate-50"
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
