import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function ChartCard({ title, children, loading, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-xl border border-border bg-card flex flex-col gap-4 p-5 ${className}`}>
      <h2 className="text-sm font-semibold text-foreground">
        {title}
      </h2>
      {loading ? (
        <Skeleton className="w-full min-h-[200px] rounded-lg" />
      ) : (
        children
      )}
    </div>
  );
}
