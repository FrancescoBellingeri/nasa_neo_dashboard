import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AsteroidDetailCard } from "@/components/asteroid/AsteroidDetailCard";
import { Header } from "@/components/layout/Header";
import { fetchNeo } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AsteroidPage({ params }: PageProps) {
  const { id } = await params;

  let asteroid;
  try {
    asteroid = await fetchNeo(id);
  } catch (err) {
    const e = err as { status?: number };
    if (e?.status === 404) notFound();
    throw err;
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </Link>
        <div className="rounded-xl border border-border/50 bg-card/50">
          <AsteroidDetailCard asteroid={asteroid} />
        </div>
      </main>
    </>
  );
}
