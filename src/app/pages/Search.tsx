import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, X, Bookmark, BookmarkCheck } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { searchPosts, toggleSavePost, type Post } from "../lib/data";

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Post[]>([]);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    const data = localStorage.getItem("search_history");
    return data ? JSON.parse(data) : [];
  });

  const handleSearch = (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    const r = searchPosts(searchQuery.trim());
    setResults(r);
    setSearched(true);

    // Save to history
    const newHistory = [searchQuery, ...history.filter((h) => h !== searchQuery)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("search_history");
  };

  const handleToggleSave = (id: string) => {
    toggleSavePost(id);
    if (searched) {
      setResults(searchPosts(query.trim()));
    }
  };

  const tagColors: Record<string, string> = {
    "财报解读": "bg-blue-100 text-blue-700",
    "新产品跟踪": "bg-green-100 text-green-700",
    "风险提示": "bg-red-100 text-red-700",
    "公司动态": "bg-purple-100 text-purple-700",
    "行业观察": "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background px-4 py-3 flex items-center gap-2 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 relative">
          <Input
            placeholder="搜索帖子、公司..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <button onClick={() => handleSearch()} className="text-sm font-medium shrink-0">
          搜索
        </button>
      </div>

      {!searched ? (
        /* History */
        history.length > 0 && (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">搜索历史</span>
              <button onClick={clearHistory} className="text-xs text-muted-foreground">
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(h)}
                  className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )
      ) : results.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
          暂无相关内容，试试其他关键词
        </div>
      ) : (
        <div>
          {results.map((post) => (
            <div key={post.id} className="p-4 border-b border-border">
              <Link to={`/post/${post.id}`} className="block">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10">
                      {post.companyName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
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
                  onClick={() => handleToggleSave(post.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
