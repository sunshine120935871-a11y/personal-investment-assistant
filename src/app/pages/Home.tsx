import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  getFollowedCompanies,
  getAllPosts,
  toggleSavePost,
  addCompanies,
  type Post,
} from "../lib/data";
import { toast } from "sonner";

function Onboarding({ onDone }: { onDone: () => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const names = input
      .split(/[,，\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (names.length === 0) {
      toast.error("请输入至少一个公司名称");
      return;
    }
    if (names.length > 20) {
      toast.error("一次最多添加20家公司");
      return;
    }
    addCompanies(names);
    toast.success(`已添加 ${names.length} 家公司`);
    onDone();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6">
      <h2 className="text-xl font-bold mb-2">添加感兴趣的公司</h2>
      <p className="text-muted-foreground text-sm mb-6 text-center">
        输入您想关注的公司名称，用逗号或换行分隔
      </p>
      <textarea
        className="w-full h-32 p-3 rounded-lg bg-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="例如：苹果, 腾讯, 贵州茅台"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button className="w-full mt-4 h-12 text-base" onClick={handleSubmit}>
        保存并生成 Agent
      </Button>
    </div>
  );
}

function PostCard({ post, onToggleSave }: { post: Post; onToggleSave: (id: string) => void }) {
  const tagColors: Record<string, string> = {
    "财报解读": "bg-blue-100 text-blue-700",
    "新产品跟踪": "bg-green-100 text-green-700",
    "风险提示": "bg-red-100 text-red-700",
    "公司动态": "bg-purple-100 text-purple-700",
    "行业观察": "bg-amber-100 text-amber-700",
  };

  return (
    <div className="p-4 border-b border-border">
      <Link to={`/post/${post.id}`} className="block">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10">{post.companyName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">{post.companyName}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-[15px] leading-snug mb-1">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
      </Link>
      <div className="flex items-center justify-between mt-2">
        <Badge variant="secondary" className={`text-xs border-0 ${tagColors[post.tag] || ""}`}>
          {post.tag}
        </Badge>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(post.id);
          }}
          className="p-1 text-muted-foreground hover:text-foreground"
        >
          {post.saved ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function Home() {
  const [companies, setCompanies] = useState(getFollowedCompanies());
  const [posts, setPosts] = useState(getAllPosts());
  const [showOnboarding, setShowOnboarding] = useState(companies.length === 0);

  const handleToggleSave = (id: string) => {
    toggleSavePost(id);
    setPosts(getAllPosts());
  };

  const handleOnboardingDone = () => {
    setCompanies(getFollowedCompanies());
    setPosts(getAllPosts());
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onDone={handleOnboardingDone} />;
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border">
        <h1 className="text-lg font-bold">首页</h1>
        <Link to="/search" className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
          <Search className="h-5 w-5" />
        </Link>
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          内容生成中，请稍后查看
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onToggleSave={handleToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
