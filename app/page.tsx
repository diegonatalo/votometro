import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { loadNational } from "@/lib/data";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <LandingPage data={loadNational()} />;
}
