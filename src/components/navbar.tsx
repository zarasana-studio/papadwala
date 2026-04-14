"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
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
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        isScrolled ? "py-4 pt-6" : "py-6"
      }`}
    >
      <motion.div
        layout
        className={`relative flex items-center justify-between px-6 transition-all duration-500 ease-out ${
          isScrolled
            ? "w-[92%] max-w-5xl rounded-full bg-yellow-50/70 backdrop-blur-xl py-3 shadow-xs"
            : "w-full max-w-7xl  rounded-none bg-transparent py-4"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-7 rounded-md bg-brand-dark flex items-center justify-center text-white font-serif font-medium text-xl shadow-lg ring-4 ring-brand-primary/10">
            P
          </div>
          <span className="font-serif text-lg font-medium text-brand-dark tracking-tight">
            Papadwala
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group py-px"
            >
              <span
                className={`text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  pathname === link.href
                    ? "text-brand-dark"
                    : "text-brand-dark/60 group-hover:text-brand-dark"
                }`}
              >
                {link.name}
              </span>
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-brand-primary rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link
            href="/cart"
            className="relative p-2 text-brand-dark hover:text-brand-primary transition-colors"
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white shadow-md ring-2 ring-white"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {!isPending && (
            <div className="flex items-center gap-3">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative size-7 rounded-md overflow-hidden border-brand-primary/20 border hover:border-brand-primary transition-colors focus:outline-none cursor-pointer">
                      <Avatar className="h-full w-full rounded-md">
                        <AvatarImage
                          src={session.user.image || ""}
                          alt={session.user.name}
                        />
                        <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-bold text-xs">
                          {session.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={15}
                    className="w-64 rounded-3xl p-3 shadow-2xl border-white/50 backdrop-blur-2xl bg-white/90"
                  >
                    <DropdownMenuLabel className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold text-brand-dark">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-brand-dark/50 font-medium">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2 bg-brand-dark/5" />
                    {process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
                      process.env.NEXT_PUBLIC_ADMIN_EMAIL.includes(
                        session.user.email,
                      ) && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-brand-primary/10 text-brand-dark cursor-pointer"
                          >
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                    <DropdownMenuItem asChild>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-xl hover:bg-brand-primary/10 text-brand-dark cursor-pointer"
                      >
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2 bg-brand-dark/5" />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="flex items-center px-4 py-3 text-sm font-bold rounded-xl text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="hidden md:flex rounded-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold px-8 shadow-sm transition-all hover:scale-105"
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-brand-dark hover:bg-brand-dark/5 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          opacity: mobileMenuOpen ? 1 : 0,
          y: mobileMenuOpen ? 0 : -20,
          pointerEvents: mobileMenuOpen ? "auto" : "none",
        }}
        className="absolute top-full left-4 right-4 mt-2 md:hidden overflow-hidden bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 z-50"
      >
        <div className="px-8 py-10 space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-2xl font-serif font-bold tracking-tight ${
                pathname === link.href
                  ? "text-brand-primary"
                  : "text-brand-dark"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!session && (
            <div className="pt-4">
              <Button
                asChild
                className="w-full rounded-2xl bg-brand-dark text-white font-bold h-14 text-lg shadow-lg"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
}
