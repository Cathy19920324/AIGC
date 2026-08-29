import { createContext, useContext, useState, ReactNode } from "react";
import {
  Tool, Competition, NewsItem,
  TOOLS_DATA, COMPS_DATA, NEWS_DATA,
} from "./mock";

interface DataContextValue {
  tools: Tool[];
  comps: Competition[];
  news: NewsItem[];
  // 访问量
  incToolView: (id: number) => void;
  incCompView: (id: number) => void;
  incNewsView: (id: number) => void;
  // 工具 CRUD
  saveTool: (t: Tool) => void;
  deleteTool: (id: number) => void;
  moveTool: (id: number, dir: -1 | 1) => void;
  // 大赛 CRUD
  saveComp: (c: Competition) => void;
  deleteComp: (id: number) => void;
  moveComp: (id: number, dir: -1 | 1) => void;
  // 资讯 CRUD
  saveNews: (n: NewsItem) => void;
  deleteNews: (id: number) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

function reorder<T extends { id: number; order: number }>(
  list: T[], id: number, dir: -1 | 1
): T[] {
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(x => x.id === id);
  const target = idx + dir;
  if (idx < 0 || target < 0 || target >= sorted.length) return list;
  const tmp = sorted[idx].order;
  sorted[idx] = { ...sorted[idx], order: sorted[target].order };
  sorted[target] = { ...sorted[target], order: tmp };
  return sorted;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>(TOOLS_DATA);
  const [comps, setComps] = useState<Competition[]>(COMPS_DATA);
  const [news, setNews] = useState<NewsItem[]>(NEWS_DATA);

  const incToolView = (id: number) =>
    setTools(s => s.map(t => t.id === id ? { ...t, views: t.views + 1 } : t));
  const incCompView = (id: number) =>
    setComps(s => s.map(c => c.id === id ? { ...c, views: c.views + 1 } : c));
  const incNewsView = (id: number) =>
    setNews(s => s.map(n => n.id === id ? { ...n, views: n.views + 1 } : n));

  const saveTool = (t: Tool) =>
    setTools(s => {
      const exists = s.some(x => x.id === t.id);
      return exists ? s.map(x => x.id === t.id ? t : x) : [...s, { ...t, order: s.length + 1 }];
    });
  const deleteTool = (id: number) => setTools(s => s.filter(t => t.id !== id));
  const moveTool = (id: number, dir: -1 | 1) => setTools(s => reorder(s, id, dir));

  const saveComp = (c: Competition) =>
    setComps(s => {
      const exists = s.some(x => x.id === c.id);
      return exists ? s.map(x => x.id === c.id ? c : x) : [...s, { ...c, order: s.length + 1 }];
    });
  const deleteComp = (id: number) => setComps(s => s.filter(c => c.id !== id));
  const moveComp = (id: number, dir: -1 | 1) => setComps(s => reorder(s, id, dir));

  const saveNews = (n: NewsItem) =>
    setNews(s => {
      const exists = s.some(x => x.id === n.id);
      return exists ? s.map(x => x.id === n.id ? n : x) : [...s, n];
    });
  const deleteNews = (id: number) => setNews(s => s.filter(n => n.id !== id));

  return (
    <DataContext.Provider
      value={{
        tools, comps, news,
        incToolView, incCompView, incNewsView,
        saveTool, deleteTool, moveTool,
        saveComp, deleteComp, moveComp,
        saveNews, deleteNews,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
