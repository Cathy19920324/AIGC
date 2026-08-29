// ─── 类型定义 ──────────────────────────────────────────────────────────────────

export type ToolTag = "付费" | "国内可用";
export type ItemStatus = "进行中" | "已结束";

// 根据开始/结束日期自动判断大赛状态
export function getCompStatus(startDate: string, endDate: string): ItemStatus {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = endDate ? new Date(endDate).getTime() : NaN;
  // 已填结束日期且今日已超过结束日期 → 已结束；否则为进行中
  if (!isNaN(end) && today > end) return "已结束";
  return "进行中";
}

export interface Tool {
  id: number;
  name: string;
  image: string;
  logo: string;
  subtitle: string;
  tags: ToolTag[];
  detail: string;
  views: number;
  order: number;
}

export interface Competition {
  id: number;
  name: string;
  image: string;
  logo: string;
  subtitle: string;
  status: ItemStatus;
  startDate: string;
  endDate: string;
  detail: string;
  views: number;
  order: number;
}

export interface NewsItem {
  id: number;
  name: string;
  image: string;
  logo: string;
  author: string;
  subtitle: string;
  status: ItemStatus;
  date: string;
  detail: string;
  views: number;
}

export interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaIdx: number;
  image: string;
  order: number;
}

// ─── 模拟数据 ──────────────────────────────────────────────────────────────────

const img = (seed: string, w = 400, h = 220) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const TOOLS_DATA: Tool[] = [
  {
    id: 1, name: "ChatGPT", views: 12500, order: 1, tags: ["付费"],
    image: img("chatgpt"), logo: img("chatgpt-logo", 80, 80),
    subtitle: "OpenAI 旗下最强对话 AI，支持多模态输入与长文本理解",
    detail: "<h3>关于 ChatGPT</h3><p>ChatGPT 是由 OpenAI 开发的人工智能聊天机器人，基于 GPT-4 架构，能够理解并生成自然语言。</p><h3>核心功能</h3><ul><li>多轮对话与上下文理解</li><li>代码生成与调试</li><li>图像识别与分析</li><li>插件与联网功能</li></ul>",
  },
  {
    id: 2, name: "Midjourney", views: 9800, order: 2, tags: ["付费"],
    image: img("midjourney"), logo: img("midjourney-logo", 80, 80),
    subtitle: "顶尖 AI 图像生成工具，艺术感极强，风格丰富多样",
    detail: "<h3>关于 Midjourney</h3><p>Midjourney 是一款通过 Discord 操作的 AI 图像生成工具，以其出色的艺术风格和高质量输出著称。</p><h3>核心功能</h3><ul><li>文字转图像生成</li><li>多种艺术风格与画风</li><li>图像变体与优化</li><li>高分辨率输出（最高 4K）</li></ul>",
  },
  {
    id: 3, name: "文心一言", views: 8600, order: 3, tags: ["国内可用"],
    image: img("wenxin"), logo: img("wenxin-logo", 80, 80),
    subtitle: "百度推出的中文大语言模型，国内可直接访问使用",
    detail: "<h3>关于 文心一言</h3><p>文心一言是百度基于文心大模型研发的知识增强大语言模型，中文理解能力突出。</p><h3>核心功能</h3><ul><li>中文对话与创作</li><li>数学推理与分析</li><li>代码生成辅助</li><li>图像理解与生成</li></ul>",
  },
  {
    id: 4, name: "通义千问", views: 7200, order: 4, tags: ["国内可用"],
    image: img("tongyi"), logo: img("tongyi-logo", 80, 80),
    subtitle: "阿里云推出的多模态大模型助手，支持超长文本处理",
    detail: "<h3>关于 通义千问</h3><p>通义千问是阿里云推出的超大规模语言模型，在中文理解、数学推理、代码生成等方面表现优异。</p>",
  },
  {
    id: 5, name: "Stable Diffusion", views: 6900, order: 5, tags: [],
    image: img("sd"), logo: img("sd-logo", 80, 80),
    subtitle: "开源 AI 图像生成模型，本地部署完全免费",
    detail: "<h3>关于 Stable Diffusion</h3><p>Stable Diffusion 是一种基于扩散模型的 AI 图像生成技术，完全开源，支持本地部署。</p>",
  },
  {
    id: 6, name: "DALL·E 3", views: 6100, order: 6, tags: ["付费"],
    image: img("dalle"), logo: img("dalle-logo", 80, 80),
    subtitle: "OpenAI 出品的文字转图像工具，理解能力超强",
    detail: "<h3>关于 DALL·E 3</h3><p>DALL·E 3 是 OpenAI 最新的图像生成模型，能够精准理解复杂的文字描述。</p>",
  },
  {
    id: 7, name: " Claude", views: 5400, order: 7, tags: ["付费"],
    image: img("claude"), logo: img("claude-logo", 80, 80),
    subtitle: "Anthropic 推出的对话 AI，长文本处理能力出色",
    detail: "<h3>关于 Claude</h3><p>Claude 是 Anthropic 公司推出的大语言模型，以安全、可靠、长上下文著称。</p>",
  },
  {
    id: 8, name: "讯飞星火", views: 4800, order: 8, tags: ["国内可用"],
    image: img("spark"), logo: img("spark-logo", 80, 80),
    subtitle: "科大讯飞推出的认知大模型，语音能力突出",
    detail: "<h3>关于 讯飞星火</h3><p>讯飞星火认知大模型是科大讯飞推出的大模型产品，语音交互能力业界领先。</p>",
  },
  {
    id: 9, name: "Runway", views: 4200, order: 9, tags: ["付费"],
    image: img("runway"), logo: img("runway-logo", 80, 80),
    subtitle: "AI 视频生成工具，轻松创作高质量视频内容",
    detail: "<h3>关于 Runway</h3><p>Runway 是一款专业的 AI 视频创作工具，支持文生视频、图生视频等多种模式。</p>",
  },
  {
    id: 10, name: "豆包", views: 3900, order: 10, tags: ["国内可用"],
    image: img("doubao"), logo: img("doubao-logo", 80, 80),
    subtitle: "字节跳动推出的 AI 助手，国内用户体验优秀",
    detail: "<h3>关于 豆包</h3><p>豆包是字节跳动推出的 AI 智能助手，支持对话、写作、翻译等多种功能。</p>",
  },
];

export const COMPS_DATA: Competition[] = [
  {
    id: 1, name: "2026 全球 AI 创新大赛", views: 8200, order: 1, status: "进行中",
    image: img("comp1"), logo: img("comp1-logo", 80, 80),
    subtitle: "面向全球开发者的顶级 AI 赛事，百万奖金池",
    startDate: "2026-07-01", endDate: "2026-12-31",
    detail: "<h3>大赛简介</h3><p>2026 全球 AI 创新大赛旨在发掘和培养优秀的 AI 创新团队，奖金池高达 100 万元。</p><h3>赛程安排</h3><ul><li>报名：6月1日 - 7月31日</li><li>初赛：8月1日 - 9月30日</li><li>决赛：11月</li></ul>",
  },
  {
    id: 2, name: "AIGC 创作大赛", views: 6500, order: 2, status: "进行中",
    image: img("comp2"), logo: img("comp2-logo", 80, 80),
    subtitle: "用 AI 工具创作优秀作品，赢取丰厚奖励",
    startDate: "2026-08-15", endDate: "2026-11-15",
    detail: "<h3>大赛简介</h3><p>AIGC 创作大赛鼓励参赛者使用 AI 工具进行创作，涵盖图像、视频、文本等多个领域。</p>",
  },
  {
    id: 3, name: "智能算法挑战赛", views: 5800, order: 3, status: "已结束",
    image: img("comp3"), logo: img("comp3-logo", 80, 80),
    subtitle: "聚焦算法优化，比拼模型精度与效率",
    startDate: "2026-03-01", endDate: "2026-06-30",
    detail: "<h3>大赛简介</h3><p>智能算法挑战赛吸引了来自全球的顶尖算法团队参与。</p>",
  },
  {
    id: 4, name: "AI 产品设计大赛", views: 4900, order: 4, status: "进行中",
    image: img("comp4"), logo: img("comp4-logo", 80, 80),
    subtitle: "探索 AI 与产品设计的完美结合",
    startDate: "2026-09-01", endDate: "2027-01-31",
    detail: "<h3>大赛简介</h3><p>AI 产品设计大赛关注 AI 技术在产品设计中的创新应用。</p>",
  },
  {
    id: 5, name: "大模型应用开发大赛", views: 4300, order: 5, status: "进行中",
    image: img("comp5"), logo: img("comp5-logo", 80, 80),
    subtitle: "基于大模型开发创新应用，赋能千行百业",
    startDate: "2026-08-01", endDate: "2026-12-15",
    detail: "<h3>大赛简介</h3><p>大模型应用开发大赛鼓励开发者基于大模型构建实用应用。</p>",
  },
  {
    id: 6, name: "AI 绘画艺术展", views: 3800, order: 6, status: "已结束",
    image: img("comp6"), logo: img("comp6-logo", 80, 80),
    subtitle: "展示 AI 绘画的艺术魅力与无限可能",
    startDate: "2026-02-01", endDate: "2026-05-31",
    detail: "<h3>大赛简介</h3><p>AI 绘画艺术展汇集了众多优秀的 AI 艺术作品。</p>",
  },
  {
    id: 7, name: "智能制造 AI 大赛", views: 3400, order: 7, status: "进行中",
    image: img("comp7"), logo: img("comp7-logo", 80, 80),
    subtitle: "AI 赋能制造业，推动智能制造升级",
    startDate: "2026-07-15", endDate: "2026-11-30",
    detail: "<h3>大赛简介</h3><p>智能制造 AI 大赛聚焦 AI 在制造业中的应用创新。</p>",
  },
  {
    id: 8, name: "AI 医疗健康创新赛", views: 3100, order: 8, status: "进行中",
    image: img("comp8"), logo: img("comp8-logo", 80, 80),
    subtitle: "AI 技术助力医疗健康行业发展",
    startDate: "2026-09-10", endDate: "2027-02-28",
    detail: "<h3>大赛简介</h3><p>AI 医疗健康创新赛关注 AI 在医疗领域的应用。</p>",
  },
  {
    id: 9, name: "AI 教育应用大赛", views: 2800, order: 9, status: "已结束",
    image: img("comp9"), logo: img("comp9-logo", 80, 80),
    subtitle: "用 AI 技术创新教育方式",
    startDate: "2026-01-15", endDate: "2026-04-30",
    detail: "<h3>大赛简介</h3><p>AI 教育应用大赛探索 AI 技术在教育场景的创新应用。</p>",
  },
  {
    id: 10, name: "AI 金融科技挑战赛", views: 2500, order: 10, status: "进行中",
    image: img("comp10"), logo: img("comp10-logo", 80, 80),
    subtitle: "AI 驱动金融科技创新",
    startDate: "2026-08-20", endDate: "2026-12-20",
    detail: "<h3>大赛简介</h3><p>AI 金融科技挑战赛聚焦 AI 在金融领域的创新应用。</p>",
  },
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1, name: "GPT-5 正式发布，多模态能力大幅提升", views: 15600,
    image: img("news1"), logo: img("news1-logo", 80, 80),
    author: "AI 前线", subtitle: "OpenAI 正式发布新一代大模型 GPT-5",
    status: "进行中", date: "2026-08-28",
    detail: "<h3>GPT-5 发布</h3><p>OpenAI 今日正式发布了新一代大语言模型 GPT-5，在多模态理解、推理能力、代码生成等方面均有显著提升。</p><h3>主要升级</h3><ul><li>多模态输入支持更丰富</li><li>推理速度提升 2 倍</li><li>上下文窗口扩展至 256K</li></ul>",
  },
  {
    id: 2, name: "国内大模型市场份额报告发布", views: 12300,
    image: img("news2"), logo: img("news2-logo", 80, 80),
    author: "量子位", subtitle: "2026 年 Q2 国内大模型市场排名出炉",
    status: "进行中", date: "2026-08-25",
    detail: "<h3>市场报告</h3><p>最新发布的国内大模型市场份额报告显示，头部厂商竞争激烈，应用层创新加速。</p>",
  },
  {
    id: 3, name: "Stable Diffusion 3.5 开源发布", views: 9800,
    image: img("news3"), logo: img("news3-logo", 80, 80),
    author: "机器之心", subtitle: "图像生成质量全面升级",
    status: "进行中", date: "2026-08-22",
    detail: "<h3>新版本发布</h3><p>Stability AI 发布了 Stable Diffusion 3.5，图像生成质量和文本理解能力均有显著提升。</p>",
  },
  {
    id: 4, name: "AI 视频生成技术突破新里程碑", views: 8700,
    image: img("news4"), logo: img("news4-logo", 80, 80),
    author: "新智元", subtitle: "视频时长与画质均实现飞跃",
    status: "进行中", date: "2026-08-20",
    detail: "<h3>技术突破</h3><p>多家厂商在 AI 视频生成领域取得重大突破，视频时长和画质均实现飞跃。</p>",
  },
  {
    id: 5, name: "开源大模型 Llama 4 震撼登场", views: 7600,
    image: img("news5"), logo: img("news5-logo", 80, 80),
    author: "AI 科技评论", subtitle: "性能直逼闭源模型",
    status: "已结束", date: "2026-08-18",
    detail: "<h3>Llama 4 发布</h3><p>Meta 发布了开源大模型 Llama 4，性能表现直逼顶级闭源模型。</p>",
  },
  {
    id: 6, name: "2026 AI 行业发展趋势分析", views: 6500,
    image: img("news6"), logo: img("news6-logo", 80, 80),
    author: "亿欧网", subtitle: "行业进入深度应用阶段",
    status: "进行中", date: "2026-08-15",
    detail: "<h3>趋势分析</h3><p>2026 年 AI 行业进入深度应用阶段，企业级应用场景持续拓展。</p>",
  },
  {
    id: 7, name: "AI Agent 迎来爆发式增长", views: 5900,
    image: img("news7"), logo: img("news7-logo", 80, 80),
    author: "36氪", subtitle: "智能体成为新风口",
    status: "进行中", date: "2026-08-12",
    detail: "<h3>AI Agent 爆发</h3><p>AI Agent 技术迎来爆发式增长，成为行业新风口。</p>",
  },
  {
    id: 8, name: "多模态大模型成为标配", views: 5200,
    image: img("news8"), logo: img("news8-logo", 80, 80),
    author: "虎嗅网", subtitle: "单模态模型逐渐退出舞台",
    status: "进行中", date: "2026-08-10",
    detail: "<h3>多模态成标配</h3><p>多模态大模型逐渐成为行业标配，单模态模型市场空间持续收窄。</p>",
  },
  {
    id: 9, name: "AI 芯片市场竞争白热化", views: 4800,
    image: img("news9"), logo: img("news9-logo", 80, 80),
    author: "钛媒体", subtitle: "国产芯片加速崛起",
    status: "进行中", date: "2026-08-08",
    detail: "<h3>芯片市场</h3><p>AI 芯片市场竞争白热化，国产芯片加速崛起，性能不断突破。</p>",
  },
  {
    id: 10, name: "AI 伦理与监管新规出台", views: 4300,
    image: img("news10"), logo: img("news10-logo", 80, 80),
    author: "财经网", subtitle: "行业规范发展",
    status: "已结束", date: "2026-08-05",
    detail: "<h3>监管新规</h3><p>AI 伦理与监管新规正式出台，引导行业规范健康发展。</p>",
  },
];

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    title: "探索 AIGC 的无限可能",
    subtitle: "聚合全球优质 AI 工具、大赛与资讯，一站式获取",
    cta: "浏览工具",
    ctaIdx: 0,
    image: img("banner1", 1200, 400),
    order: 1,
  },
  {
    id: 2,
    title: "参与 AI 大赛，赢取丰厚奖金",
    subtitle: "汇聚全球顶级 AI 赛事，展现你的技术实力",
    cta: "查看大赛",
    ctaIdx: 1,
    image: img("banner2", 1200, 400),
    order: 2,
  },
  {
    id: 3,
    title: "掌握 AIGC 行业最新动态",
    subtitle: "第一时间获取 AI 领域资讯，洞察行业趋势",
    cta: "阅读资讯",
    ctaIdx: 2,
    image: img("banner3", 1200, 400),
    order: 3,
  },
];
