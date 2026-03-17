import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Bookmark,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  getUserProfile,
  updateUserProfile,
  getSavedPosts,
  logout,
  toggleSavePost,
  type Post,
} from "../lib/data";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookmarkCheck } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getUserProfile());
  const [editing, setEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);

  const handleSave = () => {
    updateUserProfile({ name: editName, bio: editBio });
    setProfile(getUserProfile());
    setEditing(false);
    toast.success("已保存");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    toast.success("已退出登录");
  };

  const handleShowSaved = () => {
    setSavedPosts(getSavedPosts());
    setShowSaved(true);
  };

  const handleUnsave = (id: string) => {
    toggleSavePost(id);
    setSavedPosts(getSavedPosts());
  };

  const tagColors: Record<string, string> = {
    "财报解读": "bg-blue-100 text-blue-700",
    "新产品跟踪": "bg-green-100 text-green-700",
    "风险提示": "bg-red-100 text-red-700",
    "公司动态": "bg-purple-100 text-purple-700",
    "行业观察": "bg-amber-100 text-amber-700",
  };

  if (showSaved) {
    return (
      <div className="pb-16">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-border">
          <button onClick={() => setShowSaved(false)} className="p-1 -ml-1">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <span className="font-semibold">我的收藏</span>
        </div>
        {savedPosts.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            暂无收藏内容
          </div>
        ) : (
          savedPosts.map((post) => (
            <div key={post.id} className="p-4 border-b border-border">
              <Link to={`/post/${post.id}`} className="block">
                <h3 className="font-semibold text-[15px] mb-1">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.summary}</p>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className={`text-xs border-0 ${tagColors[post.tag] || ""}`}>
                  {post.tag}
                </Badge>
                <button onClick={() => handleUnsave(post.id)} className="p-1">
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 border-b border-border">
        <h1 className="text-lg font-bold">我的</h1>
      </div>

      {/* Profile card */}
      <div className="px-4 py-6 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-xl font-bold">
            {profile.name[0] || <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          {editing ? (
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="昵称"
              />
              <Input
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="个性签名"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  保存
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div onClick={() => setEditing(true)} className="cursor-pointer">
              <div className="font-semibold text-lg">{profile.name}</div>
              <div className="text-sm text-muted-foreground">{profile.bio || "点击编辑个性签名"}</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="px-4 space-y-1">
        <button
          onClick={handleShowSaved}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted transition-colors"
        >
          <Bookmark className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-left text-sm font-medium">我的收藏</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted transition-colors text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="flex-1 text-left text-sm font-medium">退出登录</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
