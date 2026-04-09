"use client";

import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ShoppingCart, User, LogOut, Package, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const { items: cart } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isTransparent = pathname === "/" && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-serif text-2xl font-bold transition-transform group-hover:rotate-12 group-active:scale-95">
            P
          </div>
          <span
            className={cn(
              "text-2xl font-serif font-bold tracking-tight transition-colors",
              isTransparent ? "text-white" : "text-slate-900",
            )}
          >
            Papadwala
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink
            href="/"
            active={pathname === "/"}
            transparent={isTransparent}
          >
            Home
          </NavLink>
          <NavLink
            href="/products"
            active={pathname.startsWith("/products")}
            transparent={isTransparent}
          >
            Products
          </NavLink>
          <NavLink
            href="/about"
            active={pathname === "/about"}
            transparent={isTransparent}
          >
            About
          </NavLink>
          <NavLink
            href="/contact"
            active={pathname === "/contact"}
            transparent={isTransparent}
          >
            Contact
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            className={cn(
              "p-2 rounded-full transition-colors",
              isTransparent
                ? "hover:bg-white/10 text-white"
                : "hover:bg-slate-100 text-slate-600",
            )}
          >
            <Search className="w-5 h-5" />
          </button>

          <Link href="/cart" className="relative p-2 group">
            <ShoppingCart
              className={cn(
                "w-5 h-5 transition-colors",
                isTransparent ? "text-white" : "text-slate-600",
              )}
            />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white transform translate-x-1/2 -translate-y-1/2 animate-in zoom-in-0 duration-300">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 outline-none">
                  <Avatar className="w-9 h-9 border-2 border-white ring-2 ring-primary/20 transition-transform active:scale-95">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {session.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mt-2 rounded-2xl p-2 border-slate-100 shadow-xl"
              >
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                >
                  <Link href="/profile" className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                >
                  <Link href="/orders" className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                {session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                  >
                    <Link href="/admin" className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem
                  className="rounded-xl px-3 py-2 text-destructive focus:text-destructive focus:bg-destructive/5 transition-colors cursor-pointer flex items-center gap-3"
                  onClick={() =>
                    authClient.signOut({
                      fetchOptions: {
                        onSuccess: () => window.location.reload(),
                      },
                    })
                  }
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              className={cn(
                "rounded-full px-6 font-semibold transition-all duration-300",
                isTransparent
                  ? "bg-white text-slate-900 hover:bg-slate-100"
                  : "bg-slate-900 text-white hover:bg-slate-800",
              )}
              onClick={() => authClient.signIn.social({ provider: "google" })}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  transparent,
  children,
}: {
  href: string;
  active: boolean;
  transparent: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-semibold tracking-wide transition-all group relative py-1",
        transparent
          ? active
            ? "text-white"
            : "text-white/70 hover:text-white"
          : active
            ? "text-primary"
            : "text-slate-600 hover:text-primary",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
          transparent ? "bg-white" : "bg-primary",
          active && "scale-x-100",
        )}
      />
    </Link>
  );
}
