import { useNavigate } from "react-router-dom";
import { useData } from "../data/DataContext";
import { Carousel } from "../components/common/Carousel";
import { SectionHeader } from "../components/common/SectionHeader";
import { ToolCard } from "../components/cards/ToolCard";
import { CompCard } from "../components/cards/CompCard";
import { NewsCard } from "../components/cards/NewsCard";

export default function Home() {
  const { tools, comps, news, banners, incToolView, incCompView, incNewsView } = useData();
  const navigate = useNavigate();

  const hotTools = [...tools].sort((a, b) => a.order - b.order).slice(0, 10);
  const latestComps = [...comps].sort((a, b) => a.order - b.order).slice(0, 10);
  const latestNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      <Carousel slides={sortedBanners} />

      <section>
        <SectionHeader
          title="热门工具"
          subtitle="精选全球最受欢迎的 AIGC 工具"
          onMore={() => navigate("/tools")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {hotTools.map(t => (
            <ToolCard
              key={t.id}
              tool={t}
              onClick={() => { incToolView(t.id); navigate(`/tools/${t.id}`); }}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="最新大赛"
          subtitle="参与 AI 创新竞技，展示你的技术实力"
          onMore={() => navigate("/competitions")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {latestComps.map(c => (
            <CompCard
              key={c.id}
              comp={c}
              onClick={() => { incCompView(c.id); navigate(`/competitions/${c.id}`); }}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="最新资讯"
          subtitle="第一时间掌握 AIGC 行业动态"
          onMore={() => navigate("/news")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {latestNews.map(n => (
            <NewsCard
              key={n.id}
              news={n}
              onClick={() => { incNewsView(n.id); navigate(`/news/${n.id}`); }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
