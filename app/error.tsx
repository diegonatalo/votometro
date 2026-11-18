"use client";

import { ErrorScreen } from "@/components/error-screen";

type ErrorPageProps = {
  error: unknown;
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  return <ErrorScreen error={error} retry={retry} />;
}
