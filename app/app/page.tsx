import type { Metadata } from "next";
import { ResultsScreen } from "@/components/results-screen";

export const metadata: Metadata = { alternates: { canonical: "/app" } };

export default function Page() {
  return <ResultsScreen />;
}
