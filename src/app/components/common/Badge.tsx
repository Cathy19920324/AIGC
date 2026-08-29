import { ToolTag, ItemStatus } from "../../data/mock";

export function TagBadge({ tag }: { tag: ToolTag }) {
  const styles: Record<ToolTag, string> = {
    "付费": "bg-amber-50 text-amber-600 border-amber-200",
    "国内可用": "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border ${styles[tag]}`}>
      {tag}
    </span>
  );
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const isOngoing = status === "进行中";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border ${
      isOngoing
        ? "bg-blue-50 text-blue-600 border-blue-200"
        : "bg-gray-100 text-gray-500 border-gray-200"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "bg-blue-500 animate-pulse" : "bg-gray-400"}`} />
      {status}
    </span>
  );
}
