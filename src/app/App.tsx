import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./data/DataContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import ToolDetail from "./pages/ToolDetail";
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Admin from "./pages/Admin";

// 前台布局：公共导航 + 内容 + 底部
function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      <Navbar />
      <main className="flex-1 pt-[60px]">{children}</main>
      <Footer />
    </div>
  );
}

// 后台布局：独立，不包含公共导航与底部
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter basename="/AIGC">
        <Routes>
          {/* 前台 */}
          <Route path="/" element={<FrontendLayout><Home /></FrontendLayout>} />
          <Route path="/tools" element={<FrontendLayout><Tools /></FrontendLayout>} />
          <Route path="/tools/:id" element={<FrontendLayout><ToolDetail /></FrontendLayout>} />
          <Route path="/competitions" element={<FrontendLayout><Competitions /></FrontendLayout>} />
          <Route path="/competitions/:id" element={<FrontendLayout><CompetitionDetail /></FrontendLayout>} />
          <Route path="/news" element={<FrontendLayout><News /></FrontendLayout>} />
          <Route path="/news/:id" element={<FrontendLayout><NewsDetail /></FrontendLayout>} />
          {/* 后台：独立访问入口 */}
          <Route path="/admin" element={<AdminLayout><Admin /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
