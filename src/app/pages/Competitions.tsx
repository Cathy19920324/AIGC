import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useData } from "../data/DataContext";
import { CompCard } from "../components/cards/CompCard";
import { EmptyState } from "../components/common/EmptyState";
import { GridSkeleton } from "../components/common/Skeleton";
import { Carousel } from "../components/common/Carousel";

export default function Competitions() {
  const { comps, banners, incCompView } = useData();
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = [...comps]
    .sort((a, b) => b.views - a.views)
    .filter(c => c.name.includes(search) || c.subtitle.includes(search));

  const handleClick = (id: number) => {
    incCompView(id);
    navigate(`/competitions/${id}`);
  };

  const handleCta = (idx: number) => {
    navigate(idx === 0 ? "/tools" : idx === 1 ? "/competitions" : "/news");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <Carousel slides={sortedBanners} onCta={handleCta} />
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">AI 大赛</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索大赛..."
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
          {filtered.map(c => (
            <CompCard key={c.id} comp={c} onClick={() => handleClick(c.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
