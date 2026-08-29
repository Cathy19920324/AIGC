import { Competition, getCompStatus } from "../../data/mock";
import { StatusBadge } from "../common/Badge";

export function CompCard({ comp, onClick }: { comp: Competition; onClick: () => void }) {
  const status = getCompStatus(comp.startDate, comp.endDate);
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden">
        <img
          src={comp.image}
          alt={comp.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{comp.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed h-8">
          {comp.subtitle}
        </p>
      </div>
    </div>
  );
}
