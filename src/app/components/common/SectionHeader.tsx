import { ChevronRight } from "lucide-react";

export function SectionHeader({
  title, subtitle, onMore,
}: {
  title: string; subtitle?: string; onMore?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-5 bg-[#1890ff] rounded-full" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-gray-400 mt-1 ml-3.5">{subtitle}</p>}
      </div>
      {onMore && (
        <button
          onClick={onMore}
          className="flex items-center gap-0.5 text-sm text-[#1890ff] hover:text-[#40a9ff] transition-colors font-medium"
        >
          查看更多 <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
