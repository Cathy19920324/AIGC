import { Inbox } from "lucide-react";

export function EmptyState({ text = "暂无数据" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-300">
      <Inbox className="w-12 h-12 mb-3" strokeWidth={1} />
      <p className="text-sm">{text}</p>
    </div>
  );
}
