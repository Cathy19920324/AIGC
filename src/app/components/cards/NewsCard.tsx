import { NewsItem } from "../../data/mock";

export function NewsCard({ news, onClick }: { news: NewsItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-32 sm:h-36 bg-gray-100 overflow-hidden">
        <img
          src={news.image}
          alt={news.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-snug h-9">
          {news.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <img src={news.logo} alt={news.author} className="w-4 h-4 rounded-full object-cover bg-gray-100" />
          <span className="text-[11px] text-gray-400 truncate">{news.author}</span>
          <span className="text-[11px] text-gray-300 flex-shrink-0">·</span>
          <span className="text-[11px] text-gray-400 flex-shrink-0">{news.date}</span>
        </div>
      </div>
    </div>
  );
}
