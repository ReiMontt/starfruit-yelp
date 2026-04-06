import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function RestaurantSkeleton() {
  return (
    <Card className="overflow-hidden border-zinc-200">
      {/* Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <CardContent className="p-5 space-y-4">
        {/* Title & Rating Skeleton */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-12" />
        </div>

        {/* Categories Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Details Skeleton */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}
