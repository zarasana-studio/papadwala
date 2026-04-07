"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { useSession, signOut } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import * as motion from "motion/react-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Our Story", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const cartItems = useCart((state) => state.items);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-serif font-bold text-xl transition-transform group-hover:rotate-12">
              P
            </div>
            <span className="font-serif text-2xl font-bold text-brand-dark tracking-tighter">
              Papadwala
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? "text-brand-primary"
                    : "text-brand-dark hover:text-brand-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-brand-dark hover:text-brand-primary transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {!isPending && (
              <>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full p-0"
                      >
                        <Avatar className="h-10 w-10 border border-gray-100">
                          <AvatarImage
                            src={session.user.image || ""}
                            alt={session.user.name}
                          />
                          <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold">
                            {session.user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 mt-2 rounded-2xl p-2"
                    >
                      <DropdownMenuLabel className="font-serif text-brand-dark">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl cursor-pointer"
                      >
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl cursor-pointer text-destructive focus:text-destructive"
                      >
                        <button
                          className="w-full text-left flex items-center"
                          onClick={() => signOut()}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full text-brand-dark hover:text-brand-primary font-semibold"
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-brand-dark"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? "auto" : 0 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-100"
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-lg font-serif font-bold ${
                pathname === link.href
                  ? "text-brand-primary"
                  : "text-brand-dark"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!session && (
            <Button
              asChild
              className="w-full rounded-full bg-brand-primary text-white font-bold h-12"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </motion.div>
    </nav>
  );
}
