export default function FeaturesLoading() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-start pt-32 px-8 space-y-20">
      {/* High-Fidelity Hero Skeleton */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-12 flex flex-col items-start">
          {/* Badge Skeleton */}
          <div className="h-8 w-44 bg-[#000080]/20 animate-pulse rounded-full border border-[#000080]/10" />
          
          <div className="space-y-5 w-full">
            {/* Title Skeleton */}
            <div className="h-20 w-full max-w-xl bg-[#000080]/20 animate-pulse rounded-3xl" />
            <div className="h-20 w-4/5 bg-[#000080]/20 animate-pulse rounded-3xl" />
          </div>

          {/* Subtitle Skeleton */}
          <div className="space-y-4 w-full">
            <div className="h-5 w-full max-w-lg bg-[#000080]/20 animate-pulse rounded-lg" />
            <div className="h-5 w-full max-w-md bg-[#000080]/20 animate-pulse rounded-lg" />
            <div className="h-5 w-3/4 bg-[#000080]/20 animate-pulse rounded-lg" />
          </div>

          {/* CTA Skeleton */}
          <div className="h-16 w-64 bg-[#3B82F6]/20 animate-pulse rounded-2xl" />
        </div>

        {/* Mockup Reservation Skeleton */}
        <div className="hidden lg:block h-[600px] w-full bg-[#000080]/5 animate-pulse rounded-[56px] border border-white/5" />
      </div>
    </div>
  );
}
