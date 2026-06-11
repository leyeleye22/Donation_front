export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[12px] bg-gray-200 ${className}`} />;
}
