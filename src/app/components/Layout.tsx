import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, MessageSquare, User } from "lucide-react";
import { useEffect } from "react";
import { isLoggedIn } from "../lib/data";

export function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const navItems = [
    { to: "/", icon: Home, label: "首页" },
    { to: "/consultation", icon: MessageSquare, label: "咨询" },
    { to: "/profile", icon: User, label: "我的" },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
                  isActive ? "text-blue-500" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
