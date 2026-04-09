import { RichFooter } from "@/components/home/rich-footer";
import { Navbar } from "@/components/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <RichFooter />
    </>
  );
}
