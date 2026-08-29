import { Tool } from "../../data/mock";
import { TagBadge } from "../common/Badge";

export function ToolCard({ tool, onClick }: { tool: Tool; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden">
        <img
          src={tool.image}
          alt={tool.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <img
          src={tool.logo}
          alt={tool.name}
          className="absolute bottom-2 left-2 w-9 h-9 rounded-lg object-cover border border-white bg-white shadow-sm"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{tool.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2 h-8">
          {tool.subtitle}
        </p>
        <div className="flex flex-wrap gap-1">
          {tool.tags.length > 0 ? (
            tool.tags.map(t => <TagBadge key={t} tag={t} />)
          ) : (
            <span className="text-[11px] px-1.5 py-0.5 rounded border bg-gray-50 text-gray-400 border-gray-200">免费</span>
          )}
        </div>
      </div>
    </div>
  );
}
