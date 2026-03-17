export interface Post {
  id: string;
  companyId: string;
  companyName: string;
  companyAvatar: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
  createdAt: string;
  saved: boolean;
}

export interface Company {
  id: string;
  name: string;
  avatar: string;
  description: string;
}

export interface Master {
  id: string;
  name: string;
  avatar: string;
  style: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  masterId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface UserProfile {
  phone: string;
  name: string;
  avatar: string;
  bio: string;
}

const TAG_LIST = ["财报解读", "新产品跟踪", "风险提示", "公司动态", "行业观察"];

const MASTERS: Master[] = [
  {
    id: "buffett",
    name: "巴菲特",
    avatar: "",
    style: "重商业模式、护城河、长期主义、管理层质量",
    description: "股神巴菲特，价值投资的代表人物",
  },
  {
    id: "munger",
    name: "芒格",
    avatar: "",
    style: "重多元思维模型、理性决策、逆向思考",
    description: "查理·芒格，巴菲特的黄金搭档",
  },
  {
    id: "duan",
    name: "段永平",
    avatar: "",
    style: "重商业常识、长期持有、好生意好价格",
    description: "步步高创始人，知名价值投资者",
  },
  {
    id: "li",
    name: "李录",
    avatar: "",
    style: "重价值发现、时代机会、中国企业认知",
    description: "喜马拉雅资本创始人",
  },
];

function generateInitialPosts(company: Company): Post[] {
  const templates = [
    {
      title: `${company.name}公司概览：核心业务与竞争优势分析`,
      summary: `全面梳理${company.name}的商业模式、核心竞争力和市场地位，帮助投资者建立对公司的基础认知框架。`,
      content: `## 公司简介\n\n${company.name}是行业内领先的企业之一，拥有强大的品牌影响力和市场份额。\n\n## 核心业务\n\n公司的核心业务涵盖多个领域，具有较强的协同效应和增长潜力。\n\n## 竞争优势\n\n- 品牌护城河：长期积累的品牌价值\n- 规模效应：领先的市场份额带来成本优势\n- 技术壁垒：持续的研发投入构建技术护城河\n\n## 投资者关注点\n\n投资者应重点关注公司的营收增长趋势、利润率变化以及现金流状况。\n\n*仅供参考，不构成投资建议*`,
      tag: "公司动态",
    },
    {
      title: `${company.name}最新财报解读：关键数据与趋势分析`,
      summary: `深入解读${company.name}最新季度财务报告，分析营收、利润、现金流等核心指标的变化趋势。`,
      content: `## 财报概要\n\n${company.name}最新财报显示，公司整体经营保持稳健，多项核心指标达到或超出市场预期。\n\n## 关键数据\n\n- 营收：同比保持增长态势\n- 净利润：利润率有所改善\n- 现金流：经营性现金流充裕\n\n## 趋势分析\n\n从长期趋势来看，公司的营收结构持续优化，高毛利业务占比提升。\n\n## 风险提示\n\n需关注宏观经济环境变化对公司业务的潜在影响。\n\n*仅供参考，不构成投资建议*`,
      tag: "财报解读",
    },
    {
      title: `${company.name}近期重要动态汇总`,
      summary: `汇总${company.name}近期的重要业务进展、战略调整和市场动态。`,
      content: `## 近期动态\n\n${company.name}近期在业务拓展和产品创新方面有多项重要进展。\n\n## 战略调整\n\n公司持续优化业务布局，聚焦核心赛道，提升运营效率。\n\n## 市场反应\n\n市场对公司近期的战略举措总体反应积极。\n\n*仅供参考，不构成投资建议*`,
      tag: "公司动态",
    },
    {
      title: `${company.name}核心风险提示与关注要点`,
      summary: `梳理投资${company.name}需要关注的潜在风险因素，帮助投资者做出更审慎的判断。`,
      content: `## 主要风险\n\n### 行业风险\n- 行业竞争加剧\n- 政策监管变化\n\n### 经营风险\n- 新业务拓展的不确定性\n- 核心人才流失风险\n\n### 市场风险\n- 宏观经济波动影响\n- 汇率变动风险\n\n## 投资建议\n\n建议投资者综合评估以上风险因素，结合自身风险承受能力做出投资决策。\n\n*仅供参考，不构成投资建议*`,
      tag: "风险提示",
    },
  ];

  const now = Date.now();
  return templates.map((t, i) => ({
    id: `${company.id}-post-${i}`,
    companyId: company.id,
    companyName: company.name,
    companyAvatar: company.avatar,
    title: t.title,
    summary: t.summary,
    content: t.content,
    tag: t.tag,
    createdAt: new Date(now - i * 3600000).toISOString(),
    saved: false,
  }));
}

// Auth
export function isLoggedIn(): boolean {
  return !!localStorage.getItem("user_phone");
}

export function login(phone: string): void {
  localStorage.setItem("user_phone", phone);
  if (!localStorage.getItem("user_profile")) {
    const profile: UserProfile = {
      phone,
      name: `用户${phone.slice(-4)}`,
      avatar: "",
      bio: "",
    };
    localStorage.setItem("user_profile", JSON.stringify(profile));
  }
}

export function logout(): void {
  localStorage.removeItem("user_phone");
}

export function getUserProfile(): UserProfile {
  const data = localStorage.getItem("user_profile");
  if (data) return JSON.parse(data);
  return { phone: "", name: "未登录", avatar: "", bio: "" };
}

export function updateUserProfile(profile: Partial<UserProfile>): void {
  const current = getUserProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem("user_profile", JSON.stringify(updated));
}

// Companies
export function getFollowedCompanies(): Company[] {
  const data = localStorage.getItem("followed_companies");
  if (data) return JSON.parse(data);
  return [];
}

export function addCompanies(names: string[]): Company[] {
  const existing = getFollowedCompanies();
  const newCompanies: Company[] = names.map((name, i) => ({
    id: `company-${Date.now()}-${i}`,
    name: name.trim(),
    avatar: "",
    description: "",
  }));
  const all = [...existing, ...newCompanies];
  localStorage.setItem("followed_companies", JSON.stringify(all));

  // Generate initial posts for new companies
  const existingPosts = getAllPosts();
  const newPosts = newCompanies.flatMap(generateInitialPosts);
  const allPosts = [...newPosts, ...existingPosts];
  localStorage.setItem("posts", JSON.stringify(allPosts));

  return newCompanies;
}

// Posts
export function getAllPosts(): Post[] {
  const data = localStorage.getItem("posts");
  if (data) return JSON.parse(data);
  return [];
}

export function getPostById(id: string): Post | undefined {
  return getAllPosts().find((p) => p.id === id);
}

export function toggleSavePost(id: string): void {
  const posts = getAllPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.saved = !post.saved;
    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

export function getSavedPosts(): Post[] {
  return getAllPosts().filter((p) => p.saved);
}

export function searchPosts(query: string): Post[] {
  const q = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)
  );
}

// Masters
export function getAllMasters(): Master[] {
  return MASTERS;
}

export function getFollowedMasters(): Master[] {
  const data = localStorage.getItem("followed_masters");
  if (data) return JSON.parse(data);
  return [];
}

export function addMasters(ids: string[]): void {
  const masters = MASTERS.filter((m) => ids.includes(m.id));
  localStorage.setItem("followed_masters", JSON.stringify(masters));
}

// Chat
export function getChatMessages(masterId: string): ChatMessage[] {
  const data = localStorage.getItem(`chat_${masterId}`);
  if (data) return JSON.parse(data);
  return [];
}

export function addChatMessage(masterId: string, role: "user" | "assistant", content: string): void {
  const messages = getChatMessages(masterId);
  messages.push({
    id: `msg-${Date.now()}`,
    masterId,
    role,
    content,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(`chat_${masterId}`, JSON.stringify(messages));
}

export function generateMasterReply(masterId: string, question: string): string {
  const master = MASTERS.find((m) => m.id === masterId);
  if (!master) return "抱歉，无法回答您的问题。";

  const replies: Record<string, string[]> = {
    buffett: [
      `这是一个很好的问题。从价值投资的角度来看，我们需要关注企业的内在价值。正如我一直强调的，投资的关键是找到具有持久竞争优势的企业，以合理的价格买入，然后长期持有。\n\n关于您提到的问题，我建议从以下几个方面思考：\n1. 这家公司是否有强大的护城河？\n2. 管理层是否诚实且有能力？\n3. 当前价格是否提供了足够的安全边际？\n\n*仅供参考，不构成投资建议*`,
      `在评估一家企业时，我最关注的是它的商业模式是否简单易懂，是否具有持久的竞争优势。一个好的企业应该像一座城堡，周围有宽阔的护城河保护它。\n\n*仅供参考，不构成投资建议*`,
    ],
    munger: [
      `让我用多元思维模型来分析这个问题。首先，我们需要避免心理偏误的干扰，保持理性思考。\n\n从逆向思维来看，我们应该先想想什么情况下这笔投资会失败，然后反过来评估成功的概率。\n\n记住，投资中最重要的是避免愚蠢，而不是追求聪明。\n\n*仅供参考，不构成投资建议*`,
      `我的建议是：如果你没有足够的信心理解这家企业，那就不要投资。能力圈是有边界的，在能力圈内做决策才是明智的。\n\n*仅供参考，不构成投资建议*`,
    ],
    duan: [
      `做投资和做企业是一样的道理，核心就是要搞清楚什么是对的事情，然后把它做对。\n\n对于你提到的问题，我觉得关键是看这个生意的本质。好的生意有几个特征：\n1. 有差异化的产品或服务\n2. 消费者愿意为之付出溢价\n3. 长期来看能持续产生现金流\n\n不要被短期的市场波动所影响，耐心等待好价格。\n\n*仅供参考，不构成投资建议*`,
    ],
    li: [
      `从价值投资的视角来看，中国市场有很多被低估的优质企业。关键是要有独立思考的能力，不盲目跟随市场情绪。\n\n我认为评估一家企业需要关注：\n1. 它是否处在一个长期增长的行业中\n2. 它是否具有独特的竞争优势\n3. 管理团队是否值得信赖\n\n最终，投资是对未来现金流的折现，理解这一点至关重要。\n\n*仅供参考，不构成投资建议*`,
    ],
  };

  const masterReplies = replies[masterId] || replies.buffett;
  return masterReplies[Math.floor(Math.random() * masterReplies.length)];
}
