import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  getAllMasters,
  getFollowedMasters,
  addMasters,
  getChatMessages,
  addChatMessage,
  generateMasterReply,
  type Master,
  type ChatMessage,
} from "../lib/data";
import { toast } from "sonner";

function MasterOnboarding({ onDone }: { onDone: () => void }) {
  const masters = getAllMasters();
  const [selected, setSelected] = useState<string[]>([]);

  const handleSubmit = () => {
    if (selected.length === 0) {
      toast.error("请至少选择一位投资大师");
      return;
    }
    addMasters(selected);
    toast.success("已添加投资大师");
    onDone();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60dvh] px-6">
      <h2 className="text-xl font-bold mb-2">选择投资大师</h2>
      <p className="text-muted-foreground text-sm mb-6 text-center">
        选择你感兴趣的投资大师，与他们的 AI Agent 对话
      </p>
      <div className="w-full space-y-3">
        {masters.map((master) => (
          <button
            key={master.id}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(master.id)
                  ? prev.filter((id) => id !== master.id)
                  : [...prev, master.id]
              )
            }
            className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
              selected.includes(master.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-lg font-bold">
                  {master.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{master.name}</div>
                <div className="text-xs text-muted-foreground">{master.style}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Button className="w-full mt-6 h-12 text-base" onClick={handleSubmit}>
        开始咨询
      </Button>
    </div>
  );
}

export function Consultation() {
  const [followedMasters, setFollowedMasters] = useState(getFollowedMasters());
  const [showOnboarding, setShowOnboarding] = useState(followedMasters.length === 0);
  const [activeMaster, setActiveMaster] = useState<Master | null>(followedMasters[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMaster) {
      setMessages(getChatMessages(activeMaster.id));
    }
  }, [activeMaster]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOnboardingDone = () => {
    const masters = getFollowedMasters();
    setFollowedMasters(masters);
    setActiveMaster(masters[0] || null);
    setShowOnboarding(false);
  };

  const handleSend = () => {
    if (!input.trim() || !activeMaster || isTyping) return;
    const question = input.trim();
    setInput("");

    addChatMessage(activeMaster.id, "user", question);
    setMessages(getChatMessages(activeMaster.id));

    setIsTyping(true);
    setTimeout(() => {
      const reply = generateMasterReply(activeMaster.id, question);
      addChatMessage(activeMaster.id, "assistant", reply);
      setMessages(getChatMessages(activeMaster.id));
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  if (showOnboarding) {
    return <MasterOnboarding onDone={handleOnboardingDone} />;
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)]">
      {/* Master tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border overflow-x-auto shrink-0">
        {followedMasters.map((master) => (
          <button
            key={master.id}
            onClick={() => setActiveMaster(master)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeMaster?.id === master.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span>{master.name}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-10">
            <p className="mb-2">向{activeMaster?.name}提问吧</p>
            <p className="text-xs">例如：某公司是否值得长期关注？</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs">
                  {activeMaster?.name[0]}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs">
                {activeMaster?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 h-10 px-4 rounded-full bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="输入你的问题..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <Button
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
