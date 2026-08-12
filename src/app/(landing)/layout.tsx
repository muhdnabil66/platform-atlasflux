import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function LandingLayout({ children }: LayoutProps<"/">) {
  return (
    <div
      className="dark flex min-h-dvh flex-col overflow-x-clip"
      style={{ backgroundColor: "#09090B" }}
    >
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}