import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "首页", path: "/" },
  { label: "AI 工具", path: "/tools" },
  { label: "AI 大赛", path: "/competitions" },
  { label: "AI 资讯", path: "/news" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // 详情页时高亮对应列表项
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1890ff] to-[#40a9ff] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base">AIGC 聚合</span>
        </NavLink>

        {/* 桌面导航 */}
        <nav className="hidden md:flex items-stretch gap-1 self-stretch">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 text-sm font-medium transition-colors border-b-2 ${
                isActive(item.path)
                  ? "text-[#1890ff] border-[#1890ff]"
                  : "text-gray-600 hover:text-[#1890ff] border-transparent"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 移动端汉堡按钮 */}
        <button
          className="md:hidden p-1.5 text-gray-600"
          onClick={() => setOpen(v => !v)}
          aria-label="菜单"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 移动端菜单 */}
      {open && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-[#1890ff]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
