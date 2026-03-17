import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { getPostById, toggleSavePost } from "../lib/data";
import { useState } from "react";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(getPostById(id || ""));

  if (!post) {
    return (
      <div className="flex items-center justify-center h-dvh text-muted-foreground">
        帖子不存在
      </div>
    );
  }

  const handleToggleSave = () => {
    toggleSavePost(post.id);
    setPost(getPostById(post.id));
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
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold">帖子详情</span>
        <div className="flex-1" />
        <button onClick={handleToggleSave} className="p-1 -mr-1">
          {post.saved ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10">{post.companyName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{post.companyName}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mb-3 leading-tight">{post.title}</h1>

        {/* Tag */}
        <Badge variant="secondary" className={`text-xs border-0 mb-4 ${tagColors[post.tag] || ""}`}>
          {post.tag}
        </Badge>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-[15px] leading-relaxed">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className="text-lg font-bold mt-6 mb-2">
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("### ")) {
              return (
                <h3 key={i} className="text-base font-semibold mt-4 mb-1">
                  {line.replace("### ", "")}
                </h3>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <p key={i} className="ml-4 text-muted-foreground before:content-['•'] before:mr-2">
                  {line.replace("- ", "")}
                </p>
              );
            }
            if (line.startsWith("*") && line.endsWith("*")) {
              return (
                <p key={i} className="text-xs text-muted-foreground mt-4 italic">
                  {line.replace(/\*/g, "")}
                </p>
              );
            }
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i} className="text-muted-foreground mb-2">
                {line}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
