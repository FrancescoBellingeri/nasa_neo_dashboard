import { notFound } from "next/navigation";

import { AsteroidModal } from "@/components/asteroid/AsteroidModal";
import { fetchNeo } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AsteroidModalPage({ params }: PageProps) {
  const { id } = await params;

  let asteroid;
  try {
    asteroid = await fetchNeo(id);
  } catch (err) {
    const e = err as { status?: number };
    if (e?.status === 404) notFound();
    throw err;
  }

  return <AsteroidModal asteroid={asteroid} />;
}
