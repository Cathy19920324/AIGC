import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Settings, Plus, Edit2, Trash2, ChevronUp, ChevronDown, Eye,
} from "lucide-react";
import { useData } from "../data/DataContext";
import { Tool, Competition, NewsItem, ToolTag, ItemStatus } from "../data/mock";
import { TagBadge, StatusBadge } from "../components/common/Badge";
import { ModalWrap } from "../components/common/Modal";
import { ImageInput } from "../components/common/ImageInput";

type AdminTab = "tools" | "comps" | "news";
type ModalState =
  | { type: "tool"; item: Tool | null }
  | { type: "comp"; item: Competition | null }
  | { type: "news"; item: NewsItem | null }
  | null;

// ── 工具表单 ──────────────────────────────────────────────────────────────────
function ToolModal({ item, onSave, onClose }: {
  item: Tool | null; onSave: (t: Tool) => void; onClose: () => void;
}) {
  type F = Omit<Tool, "id" | "views" | "order">;
  const blank: F = { name: "", image: "", logo: "", subtitle: "", tags: [], detail: "" };
  const [form, setForm] = useState<F>(
    item ? { name: item.name, image: item.image, logo: item.logo, subtitle: item.subtitle, tags: [...item.tags], detail: item.detail } : blank
  );
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const toggleTag = (tag: ToolTag) =>
    f("tags", form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.logo) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, order: item?.order ?? 999, ...form });
  };

  return (
    <ModalWrap title={item ? "编辑工具" : "添加工具"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">工具名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入工具名称" />
        </div>
        <ImageInput label="工具图片" value={form.image} onChange={v => f("image", v)} required />
        <ImageInput label="工具 Logo" value={form.logo} onChange={v => f("logo", v)} required />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">工具副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入工具副标题" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">工具标签</label>
          <div className="flex gap-3">
            {(["付费", "国内可用"] as ToolTag[]).map(tag => (
              <label key={tag} className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={form.tags.includes(tag)} onChange={() => toggleTag(tag)} className="w-3.5 h-3.5 accent-[#1890ff]" />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono"
            placeholder="<h3>关于该工具</h3><p>详情描述...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#40a9ff] transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

// ── 大赛表单 ──────────────────────────────────────────────────────────────────
function CompModal({ item, onSave, onClose }: {
  item: Competition | null; onSave: (c: Competition) => void; onClose: () => void;
}) {
  type F = Omit<Competition, "id" | "views" | "order">;
  const blank: F = { name: "", image: "", logo: "", subtitle: "", status: "进行中", startDate: "", endDate: "", detail: "" };
  const [form, setForm] = useState<F>(
    item ? { name: item.name, image: item.image, logo: item.logo, subtitle: item.subtitle, status: item.status, startDate: item.startDate, endDate: item.endDate, detail: item.detail } : blank
  );
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.logo) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, order: item?.order ?? 999, ...form });
  };

  return (
    <ModalWrap title={item ? "编辑大赛" : "添加大赛"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入大赛名称" />
        </div>
        <ImageInput label="大赛图片" value={form.image} onChange={v => f("image", v)} required />
        <ImageInput label="大赛 Logo" value={form.logo} onChange={v => f("logo", v)} required />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入大赛副标题" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛状态<span className="text-red-500 ml-0.5">*</span></label>
          <select value={form.status} onChange={e => f("status", e.target.value as ItemStatus)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] bg-white">
            <option value="进行中">进行中</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">开始日期</label>
            <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">结束日期</label>
            <input type="date" value={form.endDate} onChange={e => f("endDate", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono"
            placeholder="<h3>大赛简介</h3><p>详情描述...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#40a9ff] transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

// ── 资讯表单 ──────────────────────────────────────────────────────────────────
function NewsModal({ item, onSave, onClose }: {
  item: NewsItem | null; onSave: (n: NewsItem) => void; onClose: () => void;
}) {
  type F = Omit<NewsItem, "id" | "views">;
  const blank: F = { name: "", image: "", logo: "", author: "", subtitle: "", status: "进行中", date: "", detail: "" };
  const [form, setForm] = useState<F>(
    item ? { name: item.name, image: item.image, logo: "", author: "", subtitle: item.subtitle, status: item.status, date: item.date, detail: item.detail } : blank
  );
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, ...form, logo: "", author: "" });
  };

  return (
    <ModalWrap title={item ? "编辑资讯" : "添加资讯"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">资讯名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入资讯标题" />
        </div>
        <ImageInput label="资讯图片" value={form.image} onChange={v => f("image", v)} required />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">发布日期</label>
            <input type="date" value={form.date} onChange={e => f("date", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
          <div />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">资讯副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入资讯副标题" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">标签</label>
          <select value={form.status} onChange={e => f("status", e.target.value as ItemStatus)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] bg-white">
            <option value="进行中">进行中</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono"
            placeholder="<h3>资讯正文</h3><p>详情内容...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#40a9ff] transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

// ── 管理后台主页面 ────────────────────────────────────────────────────────────
export default function Admin() {
  const {
    tools, comps, news,
    saveTool, deleteTool, moveTool,
    saveComp, deleteComp, moveComp,
    saveNews, deleteNews,
  } = useData();

  const [tab, setTab] = useState<AdminTab>("tools");
  const [modal, setModal] = useState<ModalState>(null);

  // 访问总次数：每次进入后台 +1，持久化到 localStorage
  const [visitCount, setVisitCount] = useState<number>(0);
  useEffect(() => {
    try {
      const n = parseInt(localStorage.getItem("aigc_admin_visits") || "0", 10) || 0;
      const next = n + 1;
      localStorage.setItem("aigc_admin_visits", String(next));
      setVisitCount(next);
    } catch {
      setVisitCount(1);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1890ff] transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> 返回前台
        </Link>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#1890ff]" />
          <h1 className="text-base font-bold text-gray-900">管理后台</h1>
          <span className="text-xs text-gray-400 font-normal flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            访问总次数：<span className="text-[#1890ff] font-semibold">{visitCount}</span>
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit overflow-x-auto">
        {([["tools", "AI工具管理"], ["comps", "AI大赛管理"], ["news", "AI资讯管理"]] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === t ? "bg-[#1890ff] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 工具管理 */}
      {tab === "tools" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">工具列表（共 {tools.length} 项）</span>
            <button onClick={() => setModal({ type: "tool", item: null })}
              className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#40a9ff] transition-colors">
              <Plus className="w-3.5 h-3.5" /> 添加工具
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[...tools].sort((a, b) => a.order - b.order).map(tool => (
              <div key={tool.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <img src={tool.logo} alt={tool.name} className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-gray-900 text-sm">{tool.name}</span>
                    {tool.tags.map(t => <TagBadge key={t} tag={t} />)}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{tool.subtitle}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mr-3 hidden sm:flex">
                  <Eye className="w-3.5 h-3.5" />
                  {tool.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveTool(tool.id, -1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveTool(tool.id, 1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setModal({ type: "tool", item: tool })} className="p-1.5 text-[#1890ff] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`确认删除「${tool.name}」？`)) deleteTool(tool.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 大赛管理 */}
      {tab === "comps" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">大赛列表（共 {comps.length} 项）</span>
            <button onClick={() => setModal({ type: "comp", item: null })}
              className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#40a9ff] transition-colors">
              <Plus className="w-3.5 h-3.5" /> 添加大赛
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[...comps].sort((a, b) => a.order - b.order).map(comp => (
              <div key={comp.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <img src={comp.logo} alt={comp.name} className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-gray-900 text-sm truncate">{comp.name}</span>
                    <StatusBadge status={comp.status} />
                  </div>
                  <p className="text-xs text-gray-400">{comp.startDate} ~ {comp.endDate}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mr-3 hidden sm:flex">
                  <Eye className="w-3.5 h-3.5" />
                  {comp.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveComp(comp.id, -1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveComp(comp.id, 1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setModal({ type: "comp", item: comp })} className="p-1.5 text-[#1890ff] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`确认删除「${comp.name}」？`)) deleteComp(comp.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 资讯管理 */}
      {tab === "news" && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900 text-sm">资讯列表（共 {news.length} 项）</span>
            <button onClick={() => setModal({ type: "news", item: null })}
              className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#40a9ff] transition-colors">
              <Plus className="w-3.5 h-3.5" /> 添加资讯
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(n => (
              <div key={n.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-gray-900 text-sm truncate">{n.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">{n.date}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mr-3 hidden sm:flex">
                  <Eye className="w-3.5 h-3.5" />
                  {n.views.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal({ type: "news", item: n })} className="p-1.5 text-[#1890ff] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { if (confirm(`确认删除「${n.name}」？`)) deleteNews(n.id); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal?.type === "tool" && (
        <ToolModal
          item={modal.item as Tool | null}
          onSave={t => { saveTool(t); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "comp" && (
        <CompModal
          item={modal.item as Competition | null}
          onSave={c => { saveComp(c); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "news" && (
        <NewsModal
          item={modal.item as NewsItem | null}
          onSave={n => { saveNews(n); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
