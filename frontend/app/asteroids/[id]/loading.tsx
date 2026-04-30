import { Skeleton } from "@/components/ui/skeleton";

export default function AsteroidLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
