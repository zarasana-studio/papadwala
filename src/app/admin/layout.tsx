import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDasboardLayout from "./AdminDasboardLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return redirect("/");
  }

  return (
    <TooltipProvider>
      <AdminDasboardLayout>{children}</AdminDasboardLayout>
    </TooltipProvider>
  );
}
