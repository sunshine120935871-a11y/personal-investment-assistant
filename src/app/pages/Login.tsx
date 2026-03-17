import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { isLoggedIn, login } from "../lib/data";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = () => {
    if (!/^1\d{10}$/.test(phone)) {
      toast.error("请输入正确的手机号");
      return;
    }
    setCountdown(60);
    toast.success("验证码已发送（测试验证码：1234）");
  };

  const handleLogin = () => {
    if (!/^1\d{10}$/.test(phone)) {
      toast.error("请输入正确的手机号");
      return;
    }
    if (!code) {
      toast.error("请输入验证码");
      return;
    }
    if (code !== "1234") {
      toast.error("验证码错误");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(phone);
      toast.success("登录成功");
      navigate("/", { replace: true });
    }, 500);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">个人投资助手</h1>
        <p className="text-muted-foreground mt-2">AI驱动的价值投资伙伴</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1.5 block">手机号</label>
            <Input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1.5 block">验证码</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleSendCode}
                disabled={countdown > 0}
                className="shrink-0 whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : "获取验证码"}
              </Button>
            </div>
          </div>

          <Button className="w-full h-12 text-base" onClick={handleLogin} disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            首次登录将自动完成注册
          </p>
        </div>
      </div>
    </div>
  );
}
