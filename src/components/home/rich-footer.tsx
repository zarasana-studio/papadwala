import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="relative pt-24 pb-8 bg-amber-50 text-amber-950">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-transparent border border-amber-900/20 text-amber-900 font-serif font-bold text-lg group-hover:bg-amber-900 group-hover:text-amber-50 transition-colors">
                P
              </span>
              <span className="font-serif text-2xl font-medium tracking-tight text-amber-950">
                Papadwala
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-amber-900/70">
              The timeless crunch. Heritage flavors, hand-rolled and sun-dried
              for the modern table.
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-xs">
              <p className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-amber-900/50 mb-3">
                Join the Family
              </p>
              <div className="flex items-center relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-amber-900/20 rounded-full py-2.5 pl-4 pr-12 text-sm text-amber-950 placeholder:text-amber-900/40 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 transition-all"
                />
                <button className="absolute right-1.5 p-1.5 rounded-full bg-amber-900/10 text-amber-900 hover:bg-amber-900 hover:text-amber-50 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 md:pl-8 lg:pl-16">
            {/* Shop */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-950 mb-2">
                Shop
              </h3>
              <FooterLink href="/products">All Papads</FooterLink>
              <FooterLink href="/products/spiced">Spiced Collection</FooterLink>
              <FooterLink href="/products/classic">
                Classic Stone Ground
              </FooterLink>
              <FooterLink href="/gifting">Festive Gifting</FooterLink>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-950 mb-2">
                Company
              </h3>
              <FooterLink href="/about">Our Roots</FooterLink>
              <FooterLink href="/process">The Process</FooterLink>
              <FooterLink href="/faq">Inquiries & FAQ</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
            </div>

            {/* Contact / Social */}
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1 mt-4 md:mt-0">
              <h3 className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-amber-950 mb-2">
                Connect
              </h3>
              <div className="flex gap-3 mb-2">
                <SocialLink
                  href="https://instagram.com"
                  icon={<FaInstagram size={18} />}
                />
                <SocialLink
                  href="https://facebook.com"
                  icon={<FaFacebook size={18} />}
                />
                <SocialLink
                  href="https://twitter.com"
                  icon={<FaTwitter size={18} />}
                />
              </div>
              <div className="space-y-2 mt-2">
                <a
                  href="mailto:hello@papadwala.com"
                  className="text-sm text-amber-900/70 hover:text-amber-950 transition-colors block"
                >
                  hello@papadwala.com
                </a>
                <p className="text-sm text-amber-900/70">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-900/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-amber-900/50">
          <p>© {new Date().getFullYear()} Papadwala. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-amber-950 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-amber-950 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/shipping"
              className="hover:text-amber-950 transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Sub-components adapted for the light theme
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-amber-900/70 hover:text-amber-950 transition-colors flex items-center gap-1.5 group w-fit"
    >
      <span className="w-0 overflow-hidden opacity-0 text-orange-600 group-hover:w-3 group-hover:opacity-100 transition-all duration-300">
        <ArrowRight size={12} />
      </span>
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 rounded-full bg-transparent border border-amber-900/20 text-amber-900 hover:bg-amber-900 hover:text-amber-50 transition-all"
    >
      {icon}
    </a>
  );
}
