import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { useData } from "../data/DataContext";
import { DetailHeader } from "../components/common/DetailHeader";
import { EmptyState } from "../components/common/EmptyState";

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tools } = useData();
  const tool = tools.find(t => t.id === Number(id));

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <EmptyState text="工具不存在" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <DetailHeader
        image={tool.image}
        logo={tool.logo}
        name={tool.name}
        subtitle={tool.subtitle}
        tags={tool.tags}
        onBack={() => navigate("/tools")}
      />
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-4 border-b border-gray-100">
          <Eye className="w-3.5 h-3.5" />
          <span>{tool.views.toLocaleString()} 次浏览</span>
        </div>
        <div
          className="text-gray-700 leading-relaxed"
          style={{ lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: tool.detail || "<p>暂无详情</p>" }}
        />
      </div>
    </div>
  );
}
