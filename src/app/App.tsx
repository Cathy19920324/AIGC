import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Search, ChevronLeft, ChevronRight, ArrowLeft, Plus,
  Edit2, Trash2, X, Eye, Menu, ChevronUp, ChevronDown, Settings
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type View =
  | "home" | "tools" | "tool-detail"
  | "competitions" | "competition-detail"
  | "news" | "news-detail" | "admin";

type ToolTag = "付费" | "国内可用";
type ItemStatus = "进行中" | "已结束";

interface Tool {
  id: number; name: string; image: string; logo: string;
  subtitle: string; tags: ToolTag[]; detail: string;
  views: number; order: number;
}

interface Competition {
  id: number; name: string; image: string; logo: string;
  subtitle: string; status: ItemStatus;
  startDate: string; endDate: string;
  detail: string; views: number; order: number;
}

interface NewsItem {
  id: number; name: string; image: string; logo: string;
  author: string; subtitle: string;
  status: ItemStatus; date: string;
  detail: string; views: number;
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const TOOLS_DATA: Tool[] = [
  { id: 1, name: "ChatGPT", views: 12500, order: 1, tags: ["付费"],
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&auto=format",
    subtitle: "OpenAI 旗下最强对话 AI，支持多模态输入与长文本理解",
    detail: "<h3>关于 ChatGPT</h3><p>ChatGPT 是由 OpenAI 开发的人工智能聊天机器人，基于 GPT-4 架构，能够理解并生成自然语言。支持代码编写、文章创作、数据分析等多种场景。</p><h3>核心功能</h3><ul><li>多轮对话与上下文理解</li><li>代码生成与调试</li><li>图像识别与分析（GPT-4V）</li><li>插件与联网功能</li></ul><h3>使用建议</h3><p>ChatGPT Plus 订阅用户可享受 GPT-4 完整能力，建议用于复杂推理、代码辅助等高级场景。</p>" },
  { id: 2, name: "Midjourney", views: 9800, order: 2, tags: ["付费"],
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4c804?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1686191128892-3b37add4c804?w=80&h=80&fit=crop&auto=format",
    subtitle: "顶尖 AI 图像生成工具，艺术感极强，风格丰富多样",
    detail: "<h3>关于 Midjourney</h3><p>Midjourney 是一款通过 Discord 操作的 AI 图像生成工具，以其出色的艺术风格和高质量输出著称。支持多种艺术风格，从写实到抽象均有覆盖。</p><h3>核心功能</h3><ul><li>文字转图像生成</li><li>多种艺术风格与画风</li><li>图像变体与优化</li><li>高分辨率输出（最高 4K）</li></ul>" },
  { id: 3, name: "文心一言", views: 8600, order: 3, tags: ["国内可用"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop&auto=format",
    subtitle: "百度推出的中文大语言模型，国内可直接访问使用",
    detail: "<h3>关于 文心一言</h3><p>文心一言（ERNIE Bot）是百度基于文心大模型研发的知识增强大语言模型，中文理解能力突出，国内用户可直接访问使用，无需任何代理工具。</p><h3>核心功能</h3><ul><li>中文对话与创作</li><li>数学推理与分析</li><li>代码生成辅助</li><li>图像理解与生成</li></ul>" },
  { id: 4, name: "通义千问", views: 7200, order: 4, tags: ["国内可用"],
    image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=80&h=80&fit=crop&auto=format",
    subtitle: "阿里云推出的多模态大模型助手，支持超长文本处理",
    detail: "<h3>关于 通义千问</h3><p>通义千问是阿里云推出的超大规模语言模型，在中文理解、数学推理、代码生成等方面具有优异表现，支持最长 32K token 上下文。</p>" },
  { id: 5, name: "Stable Diffusion", views: 6900, order: 5, tags: [],
    image: "https://images.unsplash.com/photo-1684779847639-fbcc7a65a168?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1684779847639-fbcc7a65a168?w=80&h=80&fit=crop&auto=format",
    subtitle: "开源 AI 图像生成模型，本地部署完全免费",
    detail: "<h3>关于 Stable Diffusion</h3><p>Stable Diffusion 是一种基于扩散模型的 AI 图像生成技术，完全开源，支持本地部署，无需付费即可使用完整功能。社区生态丰富，拥有大量风格模型可供下载。</p>" },
  { id: 6, name: "Claude", views: 5400, order: 6, tags: ["付费"],
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=80&h=80&fit=crop&auto=format",
    subtitle: "Anthropic 出品，擅长长文本分析与代码生成",
    detail: "<h3>关于 Claude</h3><p>Claude 是由 Anthropic 公司开发的人工智能助手，以安全性和长上下文处理能力著称，支持 200K token 超长上下文窗口，非常适合处理长文档分析任务。</p>" },
  { id: 7, name: "讯飞星火", views: 4800, order: 7, tags: ["国内可用"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&h=80&fit=crop&auto=format",
    subtitle: "科大讯飞出品，中文语音与对话能力卓越",
    detail: "<h3>关于 讯飞星火</h3><p>科大讯飞星火认知大模型是科大讯飞推出的新一代人工智能大语言模型，在语音识别和中文自然语言处理方面具有显著优势，与办公场景深度融合。</p>" },
  { id: 8, name: "DALL-E 3", views: 4200, order: 8, tags: ["付费"],
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=80&h=80&fit=crop&auto=format",
    subtitle: "OpenAI 最新图像生成模型，提示词理解力大幅提升",
    detail: "<h3>关于 DALL-E 3</h3><p>DALL-E 3 是 OpenAI 推出的第三代图像生成模型，对复杂提示词的理解能力大幅提升，已集成至 ChatGPT Plus，可直接通过对话生成图像。</p>" },
  { id: 9, name: "Gemini", views: 3900, order: 9, tags: ["付费"],
    image: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=80&h=80&fit=crop&auto=format",
    subtitle: "Google 最新多模态大模型，理解图文音视频",
    detail: "<h3>关于 Gemini</h3><p>Gemini 是 Google DeepMind 开发的多模态 AI 模型，支持文本、图像、音频、视频等多种输入形式，深度整合 Google 搜索与工作套件。</p>" },
  { id: 10, name: "豆包", views: 3600, order: 10, tags: ["国内可用"],
    image: "https://images.unsplash.com/photo-1684779848636-9a0fefc8abb9?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1684779848636-9a0fefc8abb9?w=80&h=80&fit=crop&auto=format",
    subtitle: "字节跳动出品，日常对话与内容创作场景表现出色",
    detail: "<h3>关于 豆包</h3><p>豆包是字节跳动推出的 AI 助手，基于自研云雀大模型，在日常对话、写作辅助、图像生成等场景有出色表现，免费额度充足。</p>" },
];

const COMPS_DATA: Competition[] = [
  { id: 1, name: "2025全国AI创新应用大赛", views: 3200, order: 1, status: "进行中",
    startDate: "2025-03-01", endDate: "2025-09-30",
    image: "https://images.unsplash.com/photo-1540575467537-a4e3e11a7597?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1540575467537-a4e3e11a7597?w=80&h=80&fit=crop&auto=format",
    subtitle: "面向全国高校和企业团队，聚焦AI实际应用场景，总奖金100万元",
    detail: "<h3>大赛简介</h3><p>2025全国AI创新应用大赛是由工业和信息化部主办的权威AI竞赛，面向全国高校师生和企业研发团队开放报名，旨在挖掘和培养AI应用型人才。</p><h3>参赛要求</h3><ul><li>团队规模：2-5人</li><li>技术方向：不限，鼓励跨领域创新</li><li>作品要求：有实际落地应用价值</li></ul><h3>奖项设置</h3><ul><li>一等奖：30万元 × 1名</li><li>二等奖：15万元 × 2名</li><li>三等奖：5万元 × 10名</li></ul>" },
  { id: 2, name: "AIGC内容创作挑战赛", views: 2800, order: 2, status: "进行中",
    startDate: "2025-04-15", endDate: "2025-10-15",
    image: "https://images.unsplash.com/photo-1559817762-0f93e0b9c2a9?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1559817762-0f93e0b9c2a9?w=80&h=80&fit=crop&auto=format",
    subtitle: "利用AIGC技术进行文字、图像、视频内容创作，展现无限创意",
    detail: "<h3>大赛简介</h3><p>AIGC内容创作挑战赛旨在发掘和培养优秀的AI内容创作人才，鼓励创作者用AI工具进行创新性内容创作，探索人机协作的创作边界。</p>" },
  { id: 3, name: "智能语音识别技术竞赛", views: 2100, order: 3, status: "已结束",
    startDate: "2025-01-01", endDate: "2025-04-30",
    image: "https://images.unsplash.com/photo-1543285198-3af15438178a?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1543285198-3af15438178a?w=80&h=80&fit=crop&auto=format",
    subtitle: "聚焦语音识别前沿技术，推动产学研深度融合",
    detail: "<h3>大赛简介</h3><p>智能语音识别技术竞赛专注于语音AI技术的竞技与交流，已成功举办四届，累计吸引超过5000支团队参赛，产出多项产业级成果。</p>" },
  { id: 4, name: "AI绘画艺术创作节", views: 1900, order: 4, status: "进行中",
    startDate: "2025-05-01", endDate: "2025-11-01",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=80&h=80&fit=crop&auto=format",
    subtitle: "AI赋能艺术创作，探索人机协作创作的新边界",
    detail: "<h3>大赛简介</h3><p>AI绘画艺术创作节是国内规模最大的AI艺术创作赛事之一，汇聚顶尖AI画家和艺术家共同探索AI创作的边界，全球开放报名。</p>" },
  { id: 5, name: "医疗AI影像分析大赛", views: 1600, order: 5, status: "已结束",
    startDate: "2024-12-01", endDate: "2025-03-31",
    image: "https://images.unsplash.com/photo-1591696331111-ef9586450805?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1591696331111-ef9586450805?w=80&h=80&fit=crop&auto=format",
    subtitle: "利用AI提升医疗影像诊断准确率，助力医疗健康事业",
    detail: "<h3>大赛简介</h3><p>医疗AI影像分析大赛旨在推动AI在医疗影像诊断领域的应用，提升疾病早筛和诊断的准确率。本届大赛提供真实脱敏医疗影像数据集。</p>" },
  { id: 6, name: "自然语言处理前沿竞赛", views: 1400, order: 6, status: "进行中",
    startDate: "2025-06-01", endDate: "2025-12-01",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=80&h=80&fit=crop&auto=format",
    subtitle: "探索大语言模型在复杂NLP任务上的极限能力",
    detail: "<h3>大赛简介</h3><p>自然语言处理前沿竞赛聚焦NLP领域最新挑战，包括文本理解、生成、推理等多个子任务，鼓励参赛者提出创新性解决方案。</p>" },
  { id: 7, name: "智能驾驶算法挑战赛", views: 1200, order: 7, status: "已结束",
    startDate: "2024-11-01", endDate: "2025-02-28",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=80&h=80&fit=crop&auto=format",
    subtitle: "自动驾驶感知与决策算法竞技，产业级测试场景",
    detail: "<h3>大赛简介</h3><p>智能驾驶算法挑战赛专注于自动驾驶领域的前沿算法竞技，涵盖感知、规划、决策三大核心模块，使用仿真与真实道路双重评测。</p>" },
  { id: 8, name: "数据科学黑客松2025", views: 1100, order: 8, status: "进行中",
    startDate: "2025-07-01", endDate: "2025-12-31",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=80&h=80&fit=crop&auto=format",
    subtitle: "48小时数据科学极限挑战，丰厚奖金等你来拿",
    detail: "<h3>大赛简介</h3><p>数据科学黑客松是一场紧张刺激的数据竞技活动，参赛者需在48小时内完成数据分析、建模和可视化，现场公布结果，氛围热烈。</p>" },
  { id: 9, name: "机器人AI编程挑战赛", views: 900, order: 9, status: "已结束",
    startDate: "2025-01-15", endDate: "2025-05-15",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&h=80&fit=crop&auto=format",
    subtitle: "AI驱动的机器人自主决策与控制算法竞技",
    detail: "<h3>大赛简介</h3><p>机器人AI编程挑战赛聚焦AI驱动的机器人控制技术，参赛队伍需在规定场景中完成自主导航、目标识别与抓取等任务。</p>" },
  { id: 10, name: "AI教育应用创新大赛", views: 800, order: 10, status: "进行中",
    startDate: "2025-04-01", endDate: "2025-10-31",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=80&h=80&fit=crop&auto=format",
    subtitle: "探索AI技术在教育领域的创新应用与实践",
    detail: "<h3>大赛简介</h3><p>AI教育应用创新大赛旨在发掘优质的教育AI应用，推动AI技术在教学、评测、个性化学习等场景的落地实践，促进教育公平。</p>" },
];

const NEWS_DATA: NewsItem[] = [
  { id: 1, name: "GPT-5正式发布，多项基准测试刷新纪录", views: 5600,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&h=80&fit=crop&auto=format",
    author: "科技前沿", status: "进行中", date: "2025-08-20",
    subtitle: "OpenAI发布新一代旗舰模型，在推理、代码、多模态等多个维度全面超越前代",
    detail: "<h3>发布概况</h3><p>OpenAI 在年度开发者大会上正式发布 GPT-5，这一划时代的语言模型在多项权威基准测试中创下历史最高分，引发全行业高度关注。</p><h3>核心升级</h3><ul><li>推理能力大幅提升，数学竞赛成绩媲美顶尖人类选手</li><li>代码生成能力全面超越 GitHub Copilot</li><li>多模态理解支持图像、音频、视频同时输入</li><li>上下文窗口扩展至 1M token</li></ul><h3>定价策略</h3><p>GPT-5 将以 API 形式向开发者开放，ChatGPT Plus 用户可直接使用，预计 API 价格较 GPT-4 Turbo 下降约 30%。</p>" },
  { id: 2, name: "国产大模型迎来爆发式增长，数量突破百款", views: 4800,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=80&h=80&fit=crop&auto=format",
    author: "AI观察", status: "已结束", date: "2025-08-18",
    subtitle: "2025年上半年国内大模型数量持续攀升，竞争格局愈发激烈",
    detail: "<h3>行业动态</h3><p>据国家互联网信息办公室统计，截至2025年8月，国内已备案的大语言模型数量突破100款，各大科技公司纷纷加码投入，行业竞争进入白热化阶段。</p>" },
  { id: 3, name: "Sora视频生成模型正式向公众开放", views: 4200,
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4c804?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1686191128892-3b37add4c804?w=80&h=80&fit=crop&auto=format",
    author: "深度科技", status: "进行中", date: "2025-08-15",
    subtitle: "OpenAI文字转视频模型面向全球用户开放，创作者生态迎来新机遇",
    detail: "<h3>产品发布</h3><p>OpenAI 宣布 Sora 视频生成模型正式对 ChatGPT Plus 和 Pro 用户开放，用户可通过自然语言描述生成高达 1080P 分辨率、时长最长 60 秒的视频内容。</p>" },
  { id: 4, name: "谷歌Gemini 2.0发布，多模态能力再突破", views: 3900,
    image: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=80&h=80&fit=crop&auto=format",
    author: "全球科技", status: "已结束", date: "2025-08-12",
    subtitle: "谷歌新一代AI模型在图像理解、代码生成等领域取得重大突破",
    detail: "<h3>技术突破</h3><p>谷歌 DeepMind 正式发布 Gemini 2.0 系列模型，在多项多模态基准测试中领先竞争对手，并首次支持原生音频输出能力。</p>" },
  { id: 5, name: "AI绘画版权争议迎来法律新裁决", views: 3600,
    image: "https://images.unsplash.com/photo-1684779847639-fbcc7a65a168?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1684779847639-fbcc7a65a168?w=80&h=80&fit=crop&auto=format",
    author: "法律科技", status: "进行中", date: "2025-08-10",
    subtitle: "美国法院就AI生成图像版权归属作出新判决，影响整个行业格局",
    detail: "<h3>法律动态</h3><p>美国联邦法院就一起 AI 绘画版权案件作出裁定，认定由 AI 独立生成的作品不受版权法保护，但人类创作者对 AI 的引导与编辑可主张著作权，引发广泛讨论。</p>" },
  { id: 6, name: "百度文心4.0大幅升级，性能提升40%", views: 3100,
    image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=80&h=80&fit=crop&auto=format",
    author: "科技商业", status: "已结束", date: "2025-08-08",
    subtitle: "百度最新旗舰模型中文理解、数学推理等核心能力大幅提升",
    detail: "<h3>产品发布</h3><p>百度在年度技术大会上正式发布文心大模型 4.0 版本，综合性能较上代提升约 40%，并宣布 API 调用价格再次下降 50%，加速产业化落地。</p>" },
  { id: 7, name: "AI代码助手重塑软件开发流程", views: 2800,
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=80&h=80&fit=crop&auto=format",
    author: "开发者周刊", status: "进行中", date: "2025-08-05",
    subtitle: "GitHub Copilot、Cursor等AI编程工具大幅提升开发效率",
    detail: "<h3>行业分析</h3><p>一项针对 10,000 名开发者的调查显示，使用 AI 代码助手可将日常编程效率提升 55% 以上，越来越多的企业将 AI 编程工具纳入标准开发工具链。</p>" },
  { id: 8, name: "欧盟AI法案正式生效，企业合规压力增大", views: 2400,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=80&h=80&fit=crop&auto=format",
    author: "政策解读", status: "已结束", date: "2025-08-02",
    subtitle: "全球首部综合性AI监管法规落地，高风险AI应用面临严格约束",
    detail: "<h3>政策动态</h3><p>欧盟《人工智能法案》正式生效实施，这是全球首部针对 AI 技术的综合性监管法规，对通用AI、高风险AI应用设定了严格的合规要求。违规最高罚款可达企业全球营收的 7%。</p>" },
  { id: 9, name: "阿里通义千问开源引发业界热议", views: 2100,
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=80&h=80&fit=crop&auto=format",
    author: "开源社区", status: "进行中", date: "2025-07-30",
    subtitle: "阿里云将通义千问核心模型完全开源，引发全球开发者广泛关注",
    detail: "<h3>开源动态</h3><p>阿里云宣布将通义千问系列模型完全开源，包括预训练权重和部分训练数据，GitHub Star 数在 24 小时内突破 10 万，成为史上增速最快的开源 AI 项目之一。</p>" },
  { id: 10, name: "AI视频生成技术重大突破，分辨率达8K", views: 1800,
    image: "https://images.unsplash.com/photo-1684779848636-9a0fefc8abb9?w=400&h=220&fit=crop&auto=format",
    logo: "https://images.unsplash.com/photo-1684779848636-9a0fefc8abb9?w=80&h=80&fit=crop&auto=format",
    author: "影视科技", status: "已结束", date: "2025-07-28",
    subtitle: "新一代AI视频生成模型实现8K分辨率输出，生成速度提升10倍",
    detail: "<h3>技术突破</h3><p>来自斯坦福大学和字节跳动的联合研究团队发布了最新的视频生成模型，实现了首次 AI 生成 8K 超高清视频，且单分钟视频生成时间缩短至 30 秒以内。</p>" },
];

const SLIDES = [
  { title: "探索AI无限可能", subtitle: "汇聚全球最前沿的 AIGC 工具与资源，助力你的创作与创新之旅", cta: "浏览热门工具",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&h=600&fit=crop&auto=format", ctaIdx: 0 },
  { title: "参与AI创新大赛", subtitle: "展示你的 AI 技术实力，赢取丰厚奖金与业界认可，开启职业新征程", cta: "查看最新大赛",
    image: "https://images.unsplash.com/photo-1540575467537-a4e3e11a7597?w=1400&h=600&fit=crop&auto=format", ctaIdx: 1 },
  { title: "掌握AI行业动态", subtitle: "第一时间获取 AIGC 领域最新资讯与深度分析，洞察产业变革趋势", cta: "阅读最新资讯",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&h=600&fit=crop&auto=format", ctaIdx: 2 },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

function TagBadge({ tag }: { tag: ToolTag }) {
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
      tag === "付费"
        ? "bg-amber-50 text-amber-600 border-amber-200"
        : "bg-emerald-50 text-emerald-600 border-emerald-200"
    }`}>
      {tag}
    </span>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
      status === "进行中" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === "进行中" ? "bg-blue-500" : "bg-gray-400"}`} />
      {status}
    </span>
  );
}

function SectionHeader({ title, subtitle, onMore }: { title: string; subtitle?: string; onMore?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-[#1890ff] rounded-full" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {onMore && (
        <button onClick={onMore} className="text-sm text-[#1890ff] hover:text-blue-700 flex items-center gap-0.5 transition-colors font-medium">
          查看更多 <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── CARD COMPONENTS ──────────────────────────────────────────────────────────

function ToolCard({ tool, onClick }: { tool: Tool; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="h-[130px] bg-gray-100 overflow-hidden">
        <img src={tool.image} alt={tool.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <img src={tool.logo} alt={tool.name} className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0 bg-gray-50" />
          <span className="font-semibold text-gray-900 text-sm truncate">{tool.name}</span>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-2">{tool.subtitle}</p>
        <div className="flex flex-wrap gap-1">
          {tool.tags.map(t => <TagBadge key={t} tag={t} />)}
          {tool.tags.length === 0 && <span className="text-xs text-gray-300">免费</span>}
        </div>
      </div>
    </div>
  );
}

function CompCard({ comp, onClick }: { comp: Competition; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="relative h-[130px] bg-gray-100 overflow-hidden">
        <img src={comp.image} alt={comp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 right-2">
          <StatusBadge status={comp.status} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{comp.name}</h3>
        <p className="text-gray-400 text-xs">{comp.startDate} ~ {comp.endDate}</p>
      </div>
    </div>
  );
}

function NewsCard({ news, onClick }: { news: NewsItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="h-[130px] bg-gray-100 overflow-hidden">
        <img src={news.image} alt={news.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{news.name}</h3>
        <p className="text-gray-400 text-xs">{news.author} · {news.date}</p>
      </div>
    </div>
  );
}

// ─── CAROUSEL ─────────────────────────────────────────────────────────────────

function Carousel({ slides, onCta }: { slides: typeof SLIDES; onCta: (idx: number) => void }) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCur(c => (c + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const prev = () => setCur(c => (c - 1 + slides.length) % slides.length);
  const next = () => setCur(c => (c + 1) % slides.length);

  return (
    <div
      className="relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === cur ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-16">
            <div className="max-w-md">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 leading-tight">{slide.title}</h1>
              <p className="text-gray-200 text-sm sm:text-base mb-6 leading-relaxed">{slide.subtitle}</p>
              <button
                onClick={() => onCta(slide.ctaIdx)}
                className="bg-[#1890ff] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors"
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCur(i)} className={`h-1.5 rounded-full transition-all ${i === cur ? "bg-white w-5" : "bg-white/50 w-1.5"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── IMAGE INPUT (for admin) ───────────────────────────────────────────────────

function ImageInput({ label, value, onChange, required }: { label: string; value: string; onChange: (url: string) => void; required?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(URL.createObjectURL(file));
  };
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="flex gap-2 items-start">
        {value && (
          <img src={value} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0" />
        )}
        <div className="flex-1 space-y-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-xs text-gray-500 hover:border-[#1890ff] hover:text-[#1890ff] transition-colors"
          >
            点击上传图片（PNG / JPEG）
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFile} />
          <input
            type="text"
            placeholder="或输入图片URL"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#1890ff]"
          />
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN MODALS ─────────────────────────────────────────────────────────────

function ToolModal({ item, onSave, onClose }: { item: Tool | null; onSave: (t: Tool) => void; onClose: () => void }) {
  const blank: Omit<Tool, "id" | "views" | "order"> = { name: "", image: "", logo: "", subtitle: "", tags: [], detail: "" };
  const [form, setForm] = useState<Omit<Tool, "id" | "views" | "order">>(item ? { name: item.name, image: item.image, logo: item.logo, subtitle: item.subtitle, tags: [...item.tags], detail: item.detail } : blank);
  const f = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const toggleTag = (tag: ToolTag) => f("tags", form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.logo) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, order: item?.order ?? 999, ...form });
  };
  return (
    <ModalWrap title={item ? "编辑工具" : "添加工具"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">工具名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入工具名称" />
        </div>
        <ImageInput label="工具图片" value={form.image} onChange={v => f("image", v)} required />
        <ImageInput label="工具 Logo" value={form.logo} onChange={v => f("logo", v)} required />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">工具副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入工具副标题" />
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
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML 格式）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono" placeholder="<h3>关于该工具</h3><p>详情描述...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

function CompModal({ item, onSave, onClose }: { item: Competition | null; onSave: (c: Competition) => void; onClose: () => void }) {
  type F = Omit<Competition, "id" | "views" | "order">;
  const blank: F = { name: "", image: "", logo: "", subtitle: "", status: "进行中", startDate: "", endDate: "", detail: "" };
  const [form, setForm] = useState<F>(item ? { name: item.name, image: item.image, logo: item.logo, subtitle: item.subtitle, status: item.status, startDate: item.startDate, endDate: item.endDate, detail: item.detail } : blank);
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.logo) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, order: item?.order ?? 999, ...form });
  };
  return (
    <ModalWrap title={item ? "编辑大赛" : "添加大赛"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入大赛名称" />
        </div>
        <ImageInput label="大赛图片" value={form.image} onChange={v => f("image", v)} required />
        <ImageInput label="大赛 Logo" value={form.logo} onChange={v => f("logo", v)} required />
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入大赛副标题" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">大赛状态<span className="text-red-500 ml-0.5">*</span></label>
          <select value={form.status} onChange={e => f("status", e.target.value as ItemStatus)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] bg-white">
            <option value="进行中">进行中</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">开始日期</label>
            <input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">结束日期</label>
            <input type="date" value={form.endDate} onChange={e => f("endDate", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML 格式）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono" placeholder="<h3>大赛简介</h3><p>详情描述...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

function NewsModal({ item, onSave, onClose }: { item: NewsItem | null; onSave: (n: NewsItem) => void; onClose: () => void }) {
  type F = Omit<NewsItem, "id" | "views">;
  const blank: F = { name: "", image: "", logo: "", author: "", subtitle: "", status: "进行中", date: "", detail: "" };
  const [form, setForm] = useState<F>(item ? { name: item.name, image: item.image, logo: item.logo, author: item.author, subtitle: item.subtitle, status: item.status, date: item.date, detail: item.detail } : blank);
  const f = (k: keyof F, v: unknown) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.image || !form.logo) return;
    onSave({ id: item?.id ?? Date.now(), views: item?.views ?? 0, ...form });
  };
  return (
    <ModalWrap title={item ? "编辑资讯" : "添加资讯"} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">资讯名称<span className="text-red-500 ml-0.5">*</span></label>
          <input required value={form.name} onChange={e => f("name", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="请输入资讯标题" />
        </div>
        <ImageInput label="资讯图片" value={form.image} onChange={v => f("image", v)} required />
        <ImageInput label="资讯 Logo" value={form.logo} onChange={v => f("logo", v)} required />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">作者名称</label>
            <input value={form.author} onChange={e => f("author", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" placeholder="作者" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">发布日期</label>
            <input type="date" value={form.date} onChange={e => f("date", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff]" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">资讯副标题</label>
          <textarea rows={2} value={form.subtitle} onChange={e => f("subtitle", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none" placeholder="请输入资讯副标题" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">标签</label>
          <select value={form.status} onChange={e => f("status", e.target.value as ItemStatus)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] bg-white">
            <option value="进行中">进行中</option>
            <option value="已结束">已结束</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">详情内容（支持 HTML 格式）</label>
          <textarea rows={5} value={form.detail} onChange={e => f("detail", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1890ff] resize-none font-mono" placeholder="<h3>资讯正文</h3><p>详情内容...</p>" />
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 bg-[#1890ff] text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">保存</button>
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">取消</button>
        </div>
      </form>
    </ModalWrap>
  );
}

function ModalWrap({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE HEADER ───────────────────────────────────────────────────────

function DetailHeader({ image, logo, name, subtitle, tags, status, dates, author, date, onBack }:
  { image: string; logo: string; name: string; subtitle?: string; tags?: ToolTag[]; status?: ItemStatus;
    dates?: string; author?: string; date?: string; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1890ff] transition-colors mb-5 font-medium">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 mb-6">
        <div className="h-52 sm:h-72 bg-gray-100">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <img src={logo} alt={name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 mb-1">{name}</h1>
              {subtitle && <p className="text-gray-500 text-sm leading-relaxed mb-3">{subtitle}</p>}
              <div className="flex flex-wrap items-center gap-2">
                {tags?.map(t => <TagBadge key={t} tag={t} />)}
                {status && <StatusBadge status={status} />}
                {dates && <span className="text-xs text-gray-400">{dates}</span>}
                {author && <span className="text-xs text-gray-400">{author}</span>}
                {date && <span className="text-xs text-gray-400">{date}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QR CODE SVG ──────────────────────────────────────────────────────────────

function QRCode() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,0,1,1,0,1],
    [0,1,0,0,0,1,0,1,0,0,1,1,0,1,0,1,0,0,1,0],
    [1,0,1,1,0,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,1,1,0,0,0],
    [1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,0,1,0,0,1,1,0,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,1,1,0,0,1,1,0],
  ];
  const size = 5;
  return (
    <svg width={pattern[0].length * size} height={pattern.length * size} viewBox={`0 0 ${pattern[0].length * size} ${pattern.length * size}`}>
      {pattern.map((row, r) => row.map((cell, c) => cell ? (
        <rect key={`${r}-${c}`} x={c * size} y={r * size} width={size} height={size} fill="#262626" />
      ) : null))}
    </svg>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);
  const [selectedCompId, setSelectedCompId] = useState<number | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [tools, setTools] = useState<Tool[]>(TOOLS_DATA);
  const [comps, setComps] = useState<Competition[]>(COMPS_DATA);
  const [news, setNews] = useState<NewsItem[]>(NEWS_DATA);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<"tools" | "comps" | "news">("tools");
  const [toolSearch, setToolSearch] = useState("");
  const [compSearch, setCompSearch] = useState("");
  const [newsSearch, setNewsSearch] = useState("");
  const [modal, setModal] = useState<{ type: "tool" | "comp" | "news"; item: Tool | Competition | NewsItem | null } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const navigate = (v: View) => {
    setView(v);
    setMobileOpen(false);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToolClick = (id: number) => {
    setTools(p => p.map(t => t.id === id ? { ...t, views: t.views + 1 } : t));
    setSelectedToolId(id);
    navigate("tool-detail");
  };
  const handleCompClick = (id: number) => {
    setComps(p => p.map(c => c.id === id ? { ...c, views: c.views + 1 } : c));
    setSelectedCompId(id);
    navigate("competition-detail");
  };
  const handleNewsClick = (id: number) => {
    setNews(p => p.map(n => n.id === id ? { ...n, views: n.views + 1 } : n));
    setSelectedNewsId(id);
    navigate("news-detail");
  };

  const sortedTools = [...tools].sort((a, b) => a.order - b.order);
  const sortedComps = [...comps].sort((a, b) => a.order - b.order);
  const sortedNews = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selectedTool = tools.find(t => t.id === selectedToolId);
  const selectedComp = comps.find(c => c.id === selectedCompId);
  const selectedNews = news.find(n => n.id === selectedNewsId);

  const moveItem = <T extends { order: number }>(arr: T[], setArr: React.Dispatch<React.SetStateAction<T[]>>, id: number, dir: -1 | 1) => {
    const sorted = [...arr].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x: any) => x.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    const newArr = sorted.map((item, i) => {
      if (i === idx) return { ...item, order: sorted[newIdx].order };
      if (i === newIdx) return { ...item, order: sorted[idx].order };
      return item;
    });
    setArr(newArr as T[]);
  };

  const navItems = [
    { label: "首页", v: "home" as View },
    { label: "AI工具", v: "tools" as View },
    { label: "AI大赛", v: "competitions" as View },
    { label: "AI资讯", v: "news" as View },
  ];

  const isActive = (v: View) => view === v || (view.startsWith(v.replace("-detail", "")) && v !== "home" && !v.includes("detail"));

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-['Inter','Noto_Sans_SC',system-ui,sans-serif]" ref={topRef}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("home")}>
              <div className="w-7 h-7 bg-[#1890ff] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="font-bold text-gray-900 text-base">AIGC导航</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.v}
                  onClick={() => navigate(item.v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.v) ? "bg-blue-50 text-[#1890ff]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-50" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-2 space-y-1">
            {navItems.map(item => (
              <button key={item.v} onClick={() => navigate(item.v)} className={`w-full text-left px-3 py-2.5 text-sm rounded-lg ${isActive(item.v) ? "bg-blue-50 text-[#1890ff] font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main */}
      <main className="pt-14">
        {/* HOME */}
        {view === "home" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
            <Carousel slides={SLIDES} onCta={idx => navigate(idx === 0 ? "tools" : idx === 1 ? "competitions" : "news")} />
            <section>
              <SectionHeader title="热门工具" subtitle="精选全球最受欢迎的 AIGC 工具" onMore={() => navigate("tools")} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {sortedTools.slice(0, 10).map(t => <ToolCard key={t.id} tool={t} onClick={() => handleToolClick(t.id)} />)}
              </div>
            </section>
            <section>
              <SectionHeader title="最新大赛" subtitle="参与AI创新竞技，展示你的技术实力" onMore={() => navigate("competitions")} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {sortedComps.slice(0, 10).map(c => <CompCard key={c.id} comp={c} onClick={() => handleCompClick(c.id)} />)}
              </div>
            </section>
            <section>
              <SectionHeader title="最新资讯" subtitle="第一时间掌握 AIGC 行业动态" onMore={() => navigate("news")} />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {sortedNews.slice(0, 10).map(n => <NewsCard key={n.id} news={n} onClick={() => handleNewsClick(n.id)} />)}
              </div>
            </section>
          </div>
        )}

        {/* TOOLS LIST */}
        {view === "tools" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">AI工具</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={toolSearch}
                  onChange={e => setToolSearch(e.target.value)}
                  placeholder="搜索工具..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1890ff] bg-white w-52"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...tools]
                .sort((a, b) => b.views - a.views)
                .filter(t => t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.subtitle.includes(toolSearch))
                .map(t => <ToolCard key={t.id} tool={t} onClick={() => handleToolClick(t.id)} />)}
            </div>
          </div>
        )}

        {/* TOOL DETAIL */}
        {view === "tool-detail" && selectedTool && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <DetailHeader
              image={selectedTool.image} logo={selectedTool.logo}
              name={selectedTool.name} subtitle={selectedTool.subtitle}
              tags={selectedTool.tags}
              onBack={() => navigate("tools")}
            />
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-4 border-b border-gray-100">
                <Eye className="w-3.5 h-3.5" />
                <span>{selectedTool.views.toLocaleString()} 次浏览</span>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: selectedTool.detail || "<p>暂无详情</p>" }}
              />
            </div>
          </div>
        )}

        {/* COMPETITIONS LIST */}
        {view === "competitions" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">AI大赛</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={compSearch}
                  onChange={e => setCompSearch(e.target.value)}
                  placeholder="搜索大赛..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1890ff] bg-white w-52"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...comps]
                .sort((a, b) => b.views - a.views)
                .filter(c => c.name.includes(compSearch) || c.subtitle.includes(compSearch))
                .map(c => <CompCard key={c.id} comp={c} onClick={() => handleCompClick(c.id)} />)}
            </div>
          </div>
        )}

        {/* COMPETITION DETAIL */}
        {view === "competition-detail" && selectedComp && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <DetailHeader
              image={selectedComp.image} logo={selectedComp.logo}
              name={selectedComp.name} subtitle={selectedComp.subtitle}
              status={selectedComp.status}
              dates={`${selectedComp.startDate} ~ ${selectedComp.endDate}`}
              onBack={() => navigate("competitions")}
            />
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-4 border-b border-gray-100">
                <Eye className="w-3.5 h-3.5" />
                <span>{selectedComp.views.toLocaleString()} 次浏览</span>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: selectedComp.detail || "<p>暂无详情</p>" }}
              />
            </div>
          </div>
        )}

        {/* NEWS LIST */}
        {view === "news" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">AI资讯</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={newsSearch}
                  onChange={e => setNewsSearch(e.target.value)}
                  placeholder="搜索资讯..."
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1890ff] bg-white w-52"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {sortedNews
                .filter(n => n.name.includes(newsSearch) || n.subtitle.includes(newsSearch) || n.author.includes(newsSearch))
                .map(n => <NewsCard key={n.id} news={n} onClick={() => handleNewsClick(n.id)} />)}
            </div>
          </div>
        )}

        {/* NEWS DETAIL */}
        {view === "news-detail" && selectedNews && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <DetailHeader
              image={selectedNews.image} logo={selectedNews.logo}
              name={selectedNews.name} subtitle={selectedNews.subtitle}
              status={selectedNews.status}
              author={selectedNews.author}
              date={selectedNews.date}
              onBack={() => navigate("news")}
            />
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 pb-4 border-b border-gray-100">
                <Eye className="w-3.5 h-3.5" />
                <span>{selectedNews.views.toLocaleString()} 次浏览</span>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                style={{ lineHeight: "1.8" }}
                dangerouslySetInnerHTML={{ __html: selectedNews.detail || "<p>暂无详情</p>" }}
              />
            </div>
          </div>
        )}

        {/* ADMIN */}
        {view === "admin" && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => navigate("home")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1890ff] transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> 返回前台
              </button>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#1890ff]" />
                <h1 className="text-base font-bold text-gray-900">管理后台</h1>
              </div>
            </div>
            <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 w-fit">
              {([["tools", "AI工具管理"], ["comps", "AI大赛管理"], ["news", "AI资讯管理"]] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setAdminTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${adminTab === tab ? "bg-[#1890ff] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tools admin */}
            {adminTab === "tools" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <span className="font-semibold text-gray-900 text-sm">工具列表（共 {tools.length} 项）</span>
                  <button onClick={() => setModal({ type: "tool", item: null })} className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500 transition-colors">
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
                      <div className="flex items-center gap-1 text-xs text-gray-400 mr-3">
                        <Eye className="w-3.5 h-3.5" />
                        {tool.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveItem(tools, setTools, tool.id, -1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => moveItem(tools, setTools, tool.id, 1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setModal({ type: "tool", item: tool })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setTools(p => p.filter(t => t.id !== tool.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comps admin */}
            {adminTab === "comps" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <span className="font-semibold text-gray-900 text-sm">大赛列表（共 {comps.length} 项）</span>
                  <button onClick={() => setModal({ type: "comp", item: null })} className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500 transition-colors">
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
                      <div className="flex items-center gap-1 text-xs text-gray-400 mr-3">
                        <Eye className="w-3.5 h-3.5" />
                        {comp.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveItem(comps, setComps, comp.id, -1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronUp className="w-3.5 h-3.5" /></button>
                        <button onClick={() => moveItem(comps, setComps, comp.id, 1)} className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"><ChevronDown className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setModal({ type: "comp", item: comp })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setComps(p => p.filter(c => c.id !== comp.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News admin */}
            {adminTab === "news" && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <span className="font-semibold text-gray-900 text-sm">资讯列表（共 {news.length} 项）</span>
                  <button onClick={() => setModal({ type: "news", item: null })} className="flex items-center gap-1.5 bg-[#1890ff] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> 添加资讯
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {sortedNews.map(n => (
                    <div key={n.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <img src={n.logo} alt={n.name} className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-gray-900 text-sm truncate">{n.name}</span>
                        </div>
                        <p className="text-xs text-gray-400">{n.author} · {n.date}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mr-3">
                        <Eye className="w-3.5 h-3.5" />
                        {n.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal({ type: "news", item: n })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setNews(p => p.filter(x => x.id !== n.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      {view !== "admin" && (
        <footer className="mt-12 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-[#1890ff] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                  <span className="font-bold text-gray-900">AIGC导航</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">汇聚全球最前沿的AIGC工具与资源，为创作者、开发者和研究者提供一站式导航服务。</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">快速导航</h4>
                <div className="space-y-2">
                  {navItems.map(item => (
                    <button key={item.v} onClick={() => navigate(item.v)} className="block text-xs text-gray-400 hover:text-[#1890ff] transition-colors">
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">商务合作</h4>
                <div className="flex items-start gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-2">
                    <QRCode />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">扫码联系商务</p>
                    <p className="text-xs text-gray-400">工具收录 / 大赛合作</p>
                    <p className="text-xs text-gray-400">广告投放 / 资源置换</p>
                    <p className="text-xs text-[#1890ff] mt-2">business@aigcnav.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
              <p className="text-xs text-gray-400">© 2025 AIGC导航. All rights reserved.</p>
              <button onClick={() => navigate("admin")} className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
                管理后台
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      {modal?.type === "tool" && (
        <ToolModal
          item={modal.item as Tool | null}
          onSave={t => { setTools(p => modal.item ? p.map(x => x.id === t.id ? t : x) : [...p, t]); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "comp" && (
        <CompModal
          item={modal.item as Competition | null}
          onSave={c => { setComps(p => modal.item ? p.map(x => x.id === c.id ? c : x) : [...p, c]); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "news" && (
        <NewsModal
          item={modal.item as NewsItem | null}
          onSave={n => { setNews(p => modal.item ? p.map(x => x.id === n.id ? n : x) : [...p, n]); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}

      <style>{`
        .prose h3 { font-size: 1rem; font-weight: 600; color: #1a1a1a; margin: 1.2em 0 0.5em; }
        .prose p { margin: 0.6em 0; color: #595959; }
        .prose ul { list-style: disc; padding-left: 1.5em; margin: 0.6em 0; }
        .prose li { margin: 0.3em 0; color: #595959; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #bfbfbf; }
      `}</style>
    </div>
  );
}
