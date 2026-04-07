"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  return <AuthForm mode="signin" />;
}
