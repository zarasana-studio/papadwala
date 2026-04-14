import React from "react";
import {
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Info,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";

export default function Contactpage() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-16 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-100/50 backdrop-blur-sm rounded-full border border-amber-200/50">
            <Sparkles size={12} className="text-amber-600" />
            <span className="text-[11px] font-medium tracking-widest uppercase text-amber-800">
              Get in Touch
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-brand-dark text-balance">
            We&apos;d love to hear from{" "}
            <span className="text-brand-primary italic">you</span>
          </h1>
          <p className="max-w-2xl text-sm font-normal text-brand-dark/70 leading-relaxed text-balance">
            Whether you have questions regarding our handcrafted papads, bulk
            orders, or simply want to say hello, our team is always here to
            connect.
          </p>
        </header>

        {/* Template Disclaimer Notice */}
        <div className="mb-16 rounded-2xl bg-amber-50 border border-amber-200/50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm mx-auto max-w-3xl">
          <div className="bg-amber-100 p-2.5 rounded-full text-amber-600 shrink-0">
            <Info size={20} strokeWidth={2} />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-[14px] font-medium text-amber-900 mb-1">
              Important Notice: Project Template
            </h4>
            <p className="text-[13px] text-amber-800/80 leading-relaxed">
              Papadwala is a premium e-commerce template and showcase
              application. This is not a functioning business and these contact
              details are for demonstration purposes only.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Contact Methods */}
          <div className="rounded-[2.5rem] bg-white border border-brand-dark/5 p-8 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] h-full">
            <h3 className="font-serif text-2xl font-normal text-brand-dark tracking-tight mb-10">
              Direct Contact
            </h3>

            <div className="space-y-10">
              <div className="flex items-start gap-5 group">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 transition-transform group-hover:scale-105">
                  <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-brand-dark mb-1">
                    WhatsApp Chat
                  </h4>
                  <p className="text-[14px] text-brand-dark/60 leading-relaxed max-w-[250px] mb-2">
                    Fastest way to reach us for order tracking and quick
                    queries.
                  </p>
                  <a
                    href="#"
                    className="text-[14px] font-medium text-brand-primary hover:underline underline-offset-4"
                  >
                    +91 (800) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 transition-transform group-hover:scale-105">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-brand-dark mb-1">
                    Email Support
                  </h4>
                  <p className="text-[14px] text-brand-dark/60 leading-relaxed max-w-[250px] mb-2">
                    For corporate gifting, bulk orders, and detailed inquiries.
                  </p>
                  <a
                    href="mailto:namaste@papadwala.demo"
                    className="text-[14px] font-medium text-brand-primary hover:underline underline-offset-4 block"
                  >
                    namaste@papadwala.demo
                  </a>
                  <a
                    href="mailto:wholesale@papadwala.demo"
                    className="text-[14px] font-medium text-brand-primary hover:underline underline-offset-4 block"
                  >
                    wholesale@papadwala.demo
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 transition-transform group-hover:scale-105">
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-medium text-brand-dark mb-1">Call Us</h4>
                  <p className="text-[14px] text-brand-dark/60 leading-relaxed mb-2">
                    <span className="opacity-80 block mb-1">
                      Mon-Fri, 9am - 6pm IST
                    </span>
                  </p>
                  <a
                    href="tel:+918001234567"
                    className="text-[14px] font-medium text-brand-primary hover:underline underline-offset-4"
                  >
                    +91 (800) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Socials & Location */}
          <div className="flex flex-col gap-8 lg:gap-12">
            <div className="rounded-[2.5rem] bg-brand-dark border border-brand-dark p-8 sm:p-10 shadow-lg text-[#FDFCF8]">
              <h3 className="font-serif text-2xl font-normal tracking-tight mb-8">
                Connect Socially
              </h3>
              <p className="text-[#FDFCF8]/70 text-[14px] leading-relaxed mb-8 text-balance">
                Follow our journey of bringing authentic traditional flavors to
                modern homes. Tag us in your spicy stories!
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href={"#"}
                  className="h-12 w-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all"
                >
                  <FaInstagram className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link
                  href="#"
                  className="h-12 w-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all"
                >
                  <FaFacebook className="h-5 w-5" strokeWidth={1.5} />
                </Link>
                <Link
                  href={"#"}
                  className="h-12 w-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all"
                >
                  <FaTwitter className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Address Box */}
            <div className="flex-1 rounded-[2.5rem] bg-white border border-brand-dark/5 p-8 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 opacity-[0.03]">
                <MapPin className="w-40 h-40" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-brand-dark tracking-tight mb-6">
                Our Kitchen
              </h3>
              <p className="text-[14px] text-brand-dark/70 leading-relaxed font-medium">
                Papadwala Headquarters
                <br />
                123 Heritage Lane, Traditional Market District
                <br />
                Mumbai, Maharashtra 400001
                <br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
