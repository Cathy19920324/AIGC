import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { QRCode } from "../common/QRCode";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌介绍 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1890ff] to-[#40a9ff] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900">AIGC 聚合</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              聚合全球优质 AIGC 工具、大赛与资讯，为用户提供一站式浏览与检索服务，助力每一位创作者与开发者。
            </p>
          </div>

          {/* 快速导航 */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">快速导航</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-[#1890ff] transition-colors">首页</Link></li>
              <li><Link to="/tools" className="text-sm text-gray-400 hover:text-[#1890ff] transition-colors">AI 工具</Link></li>
              <li><Link to="/competitions" className="text-sm text-gray-400 hover:text-[#1890ff] transition-colors">AI 大赛</Link></li>
              <li><Link to="/news" className="text-sm text-gray-400 hover:text-[#1890ff] transition-colors">AI 资讯</Link></li>
            </ul>
          </div>

          {/* 商务合作 */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-3">商务合作</h4>
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-lg border border-gray-200">
                <QRCode size={80} />
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p>扫码联系商务</p>
                <p>合作邮箱：980364901@qq.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center mt-8 pt-6 border-t border-gray-100 gap-3">
          <p className="text-xs text-gray-400">© 2026 AI工坊. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
