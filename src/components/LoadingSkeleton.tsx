import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HeroSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background animate-pulse">
    <div className="relative overflow-hidden min-h-[100vh] flex items-center justify-center">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40"></div>
      
      {/* Content skeleton */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Badge skeleton */}
          <Skeleton className="h-12 w-64 mx-auto rounded-full" />
          
          {/* Title skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-16 w-96 mx-auto" />
            <Skeleton className="h-12 w-80 mx-auto" />
            <Skeleton className="h-10 w-72 mx-auto" />
          </div>
          
          {/* Description skeleton */}
          <Skeleton className="h-6 w-96 mx-auto" />
          
          {/* Buttons skeleton */}
          <div className="flex flex-col gap-4 items-center mt-8">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
      
      {/* Stats skeleton */}
      <div className="absolute bottom-12 w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-8 animate-pulse">
              <Skeleton className="h-8 w-20 mx-auto mb-3" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="py-20">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const FAQSkeleton = () => (
  <div className="py-20">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>
      
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <HeroSkeleton />
    <TestimonialSkeleton />
    <FAQSkeleton />
  </div>
);