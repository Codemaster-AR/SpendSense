import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Wallet,
  Receipt,
  PiggyBank,
  LayoutGrid,
  Trophy,
  TrendingUp,
  MessagesSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const PRIMARY = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/more", label: "More", icon: LayoutGrid },
];

const SECONDARY = [
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/insights", label: "Insights", icon: TrendingUp },
  { to: "/money-talks", label: "Money Talks", icon: MessagesSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Wordmark({ compact = false }) {
  return (
    <span
      className={`font-heading font-extrabold tracking-tight ${compact ? "text-lg" : "text-[22px]"}`}
    >
      <span className="text-primary">Spend</span>
      <span className="text-accent">Sense</span>
    </span>
  );
}

export default function AppShell({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`);

  const moreActive = SECONDARY.some((item) => isActive(item));
  const initials = (user?.full_name || user?.email || "S").trim().charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await logout();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-[rgba(18,107,88,0.12)] bg-white lg:flex">
        <div className="px-6 pb-4 pt-6">
          <Link to="/" className="ss-focus block rounded-sm">
            <Wordmark />
          </Link>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Money, out loud
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {PRIMARY.map((item) => {
              const active = isActive(item) || (item.to === "/more" && moreActive);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`ss-focus flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Learn &amp; more
          </p>
          <ul className="space-y-1">
            {SECONDARY.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`ss-focus flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[rgba(18,107,88,0.12)] p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {user?.full_name || "SpendSense user"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="ss-focus flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[rgba(18,107,88,0.12)] bg-white/95 px-4 backdrop-blur lg:hidden">
        <Link to="/" className="ss-focus rounded-sm">
          <Wordmark compact />
        </Link>
        <Link
          to="/settings"
          className="ss-focus flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary"
        >
          {initials}
        </Link>
      </header>

      <main className="lg:pl-[240px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-9">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(18,107,88,0.12)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
          {PRIMARY.map((item) => {
            const active = isActive(item) || (item.to === "/more" && moreActive);
            return (
              <li key={item.to} className="flex-1">
                <Link
                  to={item.to}
                  className={`ss-focus flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[12px] font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-secondary" : "bg-transparent"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
