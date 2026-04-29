import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function ChartCard({ title, children, loading, className = "" }: ChartCardProps) {
  return (
    <div className={`rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col gap-3 ${className}`}>
      <h2 className="text-xs font-semibold font-mono uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[200px]">
          <Skeleton className="w-full h-full min-h-[200px] rounded-lg" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
