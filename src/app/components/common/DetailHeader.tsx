import { ArrowLeft } from "lucide-react";
import { ToolTag, ItemStatus } from "../../data/mock";
import { TagBadge, StatusBadge } from "./Badge";

export function DetailHeader({
  image, logo, name, subtitle, tags, status, dates, author, date, onBack,
}: {
  image: string; logo: string; name: string; subtitle?: string;
  tags?: ToolTag[]; status?: ItemStatus;
  dates?: string; author?: string; date?: string; onBack: () => void;
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1890ff] transition-colors mb-5 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-6">
        <div className="h-52 sm:h-72 bg-gray-100">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <img src={logo} alt={name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{name}</h1>
              {subtitle && <p className="text-gray-500 text-sm leading-relaxed mb-3">{subtitle}</p>}
              <div className="flex flex-wrap items-center gap-2">
                {tags?.map(t => <TagBadge key={t} tag={t} />)}
                {status && <StatusBadge status={status} />}
                {dates && <span className="text-xs text-gray-400">{dates}</span>}
                {author && <span className="text-xs text-gray-400">作者：{author}</span>}
                {date && <span className="text-xs text-gray-400">{date}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
