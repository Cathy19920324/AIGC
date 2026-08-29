import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Tool, Competition, NewsItem, BannerSlide,
  TOOLS_DATA, COMPS_DATA, NEWS_DATA, BANNER_SLIDES,
} from "./mock";

const LS_KEYS = {
  tools: "aigc_tools",
  comps: "aigc_comps",
  news: "aigc_news",
  banners: "aigc_banners",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function save<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

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
  moveToolTo: (sourceId: number, targetId: number) => void;
  // 大赛 CRUD
  saveComp: (c: Competition) => void;
  deleteComp: (id: number) => void;
  moveComp: (id: number, dir: -1 | 1) => void;
  moveCompTo: (sourceId: number, targetId: number) => void;
  // 资讯 CRUD
  saveNews: (n: NewsItem) => void;
  deleteNews: (id: number) => void;
  // Banner CRUD
  banners: BannerSlide[];
  saveBanner: (b: BannerSlide) => void;
  deleteBanner: (id: number) => void;
  moveBannerTo: (sourceId: number, targetId: number) => void;
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

function moveTo<T extends { id: number; order: number }>(
  list: T[], sourceId: number, targetId: number
): T[] {
  if (sourceId === targetId) return list;
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const srcIdx = sorted.findIndex(x => x.id === sourceId);
  const tgtIdx = sorted.findIndex(x => x.id === targetId);
  if (srcIdx < 0 || tgtIdx < 0) return list;
  const [moved] = sorted.splice(srcIdx, 1);
  sorted.splice(tgtIdx, 0, moved);
  return sorted.map((item, i) => ({ ...item, order: i + 1 }));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>(() => load(LS_KEYS.tools, TOOLS_DATA));
  const [comps, setComps] = useState<Competition[]>(() => load(LS_KEYS.comps, COMPS_DATA));
  const [news, setNews] = useState<NewsItem[]>(() => load(LS_KEYS.news, NEWS_DATA));
  const [banners, setBanners] = useState<BannerSlide[]>(() => load(LS_KEYS.banners, BANNER_SLIDES));

  // 持久化到 localStorage
  useEffect(() => { save(LS_KEYS.tools, tools); }, [tools]);
  useEffect(() => { save(LS_KEYS.comps, comps); }, [comps]);
  useEffect(() => { save(LS_KEYS.news, news); }, [news]);
  useEffect(() => { save(LS_KEYS.banners, banners); }, [banners]);

  // 跨标签页同步：监听 storage 事件，后台修改 → 前台实时更新
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEYS.tools && e.newValue) {
        try { setTools(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LS_KEYS.comps && e.newValue) {
        try { setComps(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LS_KEYS.news && e.newValue) {
        try { setNews(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === LS_KEYS.banners && e.newValue) {
        try { setBanners(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
  const moveToolTo = (sourceId: number, targetId: number) => setTools(s => moveTo(s, sourceId, targetId));

  const saveComp = (c: Competition) =>
    setComps(s => {
      const exists = s.some(x => x.id === c.id);
      return exists ? s.map(x => x.id === c.id ? c : x) : [...s, { ...c, order: s.length + 1 }];
    });
  const deleteComp = (id: number) => setComps(s => s.filter(c => c.id !== id));
  const moveComp = (id: number, dir: -1 | 1) => setComps(s => reorder(s, id, dir));
  const moveCompTo = (sourceId: number, targetId: number) => setComps(s => moveTo(s, sourceId, targetId));

  const saveNews = (n: NewsItem) =>
    setNews(s => {
      const exists = s.some(x => x.id === n.id);
      return exists ? s.map(x => x.id === n.id ? n : x) : [...s, n];
    });
  const deleteNews = (id: number) => setNews(s => s.filter(n => n.id !== id));

  const saveBanner = (b: BannerSlide) =>
    setBanners(s => {
      const exists = s.some(x => x.id === b.id);
      return exists ? s.map(x => x.id === b.id ? b : x) : [...s, { ...b, order: s.length + 1 }];
    });
  const deleteBanner = (id: number) => setBanners(s => s.filter(b => b.id !== id));
  const moveBannerTo = (sourceId: number, targetId: number) => setBanners(s => moveTo(s, sourceId, targetId));

  return (
    <DataContext.Provider
      value={{
        tools, comps, news, banners,
        incToolView, incCompView, incNewsView,
        saveTool, deleteTool, moveTool, moveToolTo,
        saveComp, deleteComp, moveComp, moveCompTo,
        saveNews, deleteNews,
        saveBanner, deleteBanner, moveBannerTo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
