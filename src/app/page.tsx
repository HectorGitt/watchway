import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { RoleExplainer } from "@/components/landing/RoleExplainer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <Hero />
      <Problem />
      <RoleExplainer />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
