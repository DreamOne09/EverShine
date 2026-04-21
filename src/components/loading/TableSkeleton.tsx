import { SkeletonBlock } from './skeleton-primitives';
import { cn } from '../../lib/cn';

export interface TableSkeletonProps {
    isLoading?: boolean;
    columns?: number;
    rows?: number;
    className?: string;
}

export function TableSkeleton({
    isLoading = true,
    columns = 5,
    rows = 5,
    className,
}: TableSkeletonProps) {
    if (!isLoading) return null;

    return (
        <div className={cn('w-full overflow-hidden rounded-xl border border-white/10', className)} aria-busy aria-label="載入中">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {Array.from({ length: columns }).map((_, c) => (
                    <div key={`h-${c}`} className="p-3 border-b border-white/10 bg-white/5">
                        <SkeletonBlock className="h-3 w-20 rounded" />
                    </div>
                ))}
                {Array.from({ length: rows * columns }).map((_, i) => (
                    <div key={`c-${i}`} className="p-3 border-b border-white/5 last:border-b-0">
                        <SkeletonBlock className="h-3 w-full rounded opacity-80" />
                    </div>
                ))}
            </div>
        </div>
    );
}
