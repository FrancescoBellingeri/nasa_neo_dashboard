import { connection } from "next/server";

import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Header } from "@/components/layout/Header";
import { fetchFeed, fetchStats } from "@/lib/api";
import { daysAgoISO, todayISO } from "@/lib/formatters";

export default async function HomePage() {
  await connection();

  const start = daysAgoISO(6);
  const end = todayISO();

  const [feed, stats] = await Promise.allSettled([
    fetchFeed(start, end),
    fetchStats(start, end),
  ]);

  return (
    <>
      <Header />
      <DashboardClient
        initialFeed={feed.status === "fulfilled" ? feed.value : null}
        initialStats={stats.status === "fulfilled" ? stats.value : null}
      />
    </>
  );
}
