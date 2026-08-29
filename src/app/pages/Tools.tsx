import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useData } from "../data/DataContext";
import { BANNER_SLIDES } from "../data/mock";
import { ToolCard } from "../components/cards/ToolCard";
import { EmptyState } from "../components/common/EmptyState";
import { GridSkeleton } from "../components/common/Skeleton";
import { Carousel } from "../components/common/Carousel";

export default function Tools() {
  const { tools, incToolView } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = [...tools]
    .sort((a, b) => b.views - a.views)
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.includes(search)
    );

  const handleClick = (id: number) => {
    incToolView(id);
    navigate(`/tools/${id}`);
  };

  const handleCta = (idx: number) => {
    navigate(idx === 0 ? "/tools" : idx === 1 ? "/competitions" : "/news");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <Carousel slides={BANNER_SLIDES} onCta={handleCta} />
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">AI 工具</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索工具..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1890ff] bg-white w-48 sm:w-56"
          />
        </div>
      </div>

      {loading ? (
        <GridSkeleton count={10} />
      ) : filtered.length === 0 ? (
        <EmptyState text="暂无数据" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map(t => (
            <ToolCard key={t.id} tool={t} onClick={() => handleClick(t.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
