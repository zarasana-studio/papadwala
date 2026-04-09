"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[] | null;
  label: string | null;
  variants?: { price: string }[];
}

interface ProductCardProps {
  product: Product;
}

const footerLinks = [
  {
    title: "Collection",
    links: [
      { name: "Classic Urad", href: "/products?category=classic" },
      { name: "Spicy Masala", href: "/products?category=spicy" },
      { name: "Garlic (Lehsun)", href: "/products?category=garlic" },
      { name: "Rice Papad", href: "/products?category=rice" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Our Story", href: "/about" },
      { name: "Sustainability", href: "/legacy" },
      { name: "Contact Us", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Track Order", href: "/orders" },
      { name: "Shipping Policy", href: "/shipping" },
      { name: "Refunds & Returns", href: "/refunds" },
      { name: "F.A.Q", href: "/faq" },
    ],
  },
];

export function RichFooter() {
  return (
    <footer className="bg-slate-50 py-24 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-medium tracking-tight text-slate-900 border-b-2 border-orange-500/20 pb-1">
                PAPADWALA
              </span>
            </Link>
            <p className="max-w-xs text-[13px] font-medium leading-relaxed text-slate-500">
              Preserving the heritage of handcrafted Indian delicacies since 1987. 
              Sun-dried, small-batch, and 100% natural.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink icon={<FaInstagram size={18} />} href="#" />
              <SocialLink icon={<FaFacebookF size={16} />} href="#" />
              <SocialLink icon={<FaXTwitter size={16} />} href="#" />
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-900">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-[13px] font-medium text-slate-500 transition-colors hover:text-orange-600"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-8 p-8 rounded-[2rem] bg-white shadow-sm shadow-slate-200/50">
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-900">
                Join the Legacy
              </h3>
              <p className="text-[11px] font-medium text-slate-500">
                Subscribe for exclusive drops and heritage recipes.
              </p>
            </div>
            <div className="relative">
              <Input 
                placeholder="Email address" 
                className="h-12 rounded-2xl border-none bg-slate-50 px-4 text-xs font-medium focus:ring-1 focus:ring-orange-500/20"
              />
              <Button 
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-xl bg-orange-500 text-white transition-all hover:bg-orange-600"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-slate-400">
            © 2026 Papadwala Artisanal Foods. Built with Tradition.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[11px] font-medium text-slate-400 hover:text-slate-600">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-medium text-slate-400 hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <Link 
      href={href} 
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm shadow-slate-100 transition-all hover:bg-orange-500 hover:text-white"
    >
      {icon}
    </Link>
  );
}
