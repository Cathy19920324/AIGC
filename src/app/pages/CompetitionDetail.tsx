import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useData } from "../data/DataContext";
import { DetailHeader } from "../components/common/DetailHeader";
import { EmptyState } from "../components/common/EmptyState";

export default function CompetitionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { comps } = useData();
  const comp = comps.find(c => c.id === Number(id));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!comp) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <EmptyState text="大赛不存在" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <DetailHeader
        image={comp.image}
        name={comp.name}
        subtitle={comp.subtitle}
        status={comp.status}
        dates={`${comp.startDate} ~ ${comp.endDate}`}
        onBack={() => navigate("/competitions")}
      />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-4 border-b border-gray-100">
          <Eye className="w-3.5 h-3.5" />
          <span>{comp.views.toLocaleString()} 次浏览</span>
        </div>
        <div
          className="text-gray-700 leading-relaxed"
          style={{ lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: comp.detail || "<p>暂无详情</p>" }}
        />
      </div>
    </div>
  );
}
