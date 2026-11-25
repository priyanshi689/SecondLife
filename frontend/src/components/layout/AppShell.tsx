import { Link } from "@tanstack/react-router";
import { Bell, Compass, Home, Plus, Search, Package, Layers, GraduationCap, ShieldCheck, Repeat, User } from "lucide-react";
import type { ReactNode } from "react";
import { GreenAI } from "@/components/chatbot/GreenAI";

const live = [
  { to: "/", label: "Home", icon: Home },
  { to: "/marketplace", label: "Explore Marketplace", icon: Compass },
  { to: "/sell", label: "List an Item", icon: Plus },
] as const;

const soon = [
  { label: "Category Kits", icon: Layers },
  { label: "Semester Kits", icon: GraduationCap },
  { label: "My Listings", icon: Package },
  { label: "My Exchanges", icon: Repeat },
  { label: "GREEN Credit Score", icon: ShieldCheck },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-emerald text-primary-foreground">
        <Compass className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold">Second Life</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <Logo />
        <p className="mt-1 pl-12 text-xs opacity-70">Good things deserve another semester.</p>
        <nav className="mt-8 space-y-1">
          {live.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 px-3 text-[11px] uppercase tracking-widest opacity-50">Coming in later sprints</p>
        <div className="mt-2 space-y-1">
          {soon.map((n) => (
            <div key={n.label} className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-50">
              <n.icon className="size-4" /> {n.label}
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-3 rounded-xl bg-sidebar-accent p-3">
          <span className="grid size-9 place-items-center rounded-full bg-gold font-semibold text-gold-foreground">AS</span>
          <div className="text-sm"><p className="font-medium">Ananya S.</p><p className="text-xs opacity-70">New Member</p></div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
        <div className="lg:hidden"><Logo /></div>
        <Link to="/marketplace" className="ml-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground md:flex lg:ml-0">
          <Search className="size-4" /> Search campus treasures…
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button aria-label="Notifications" className="grid size-10 place-items-center rounded-full hover:bg-secondary"><Bell className="size-5" /></button>
          <Link to="/sell" className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-forest sm:flex">
            <Plus className="size-4" /> List an Item
          </Link>
        </div>
      </header>

      <main className="pb-24 lg:pb-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-card lg:hidden">
        <Link to="/" activeOptions={{ exact: true }} className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary font-medium" }}><Home className="size-5" />Home</Link>
        <Link to="/marketplace" className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary font-medium" }}><Compass className="size-5" />Explore</Link>
        <Link to="/sell" className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground" activeProps={{ className: "text-primary font-medium" }}><Plus className="size-5" />Sell</Link>
        <span className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground opacity-50"><User className="size-5" />Profile</span>
      </nav>
      <GreenAI />
    </div>
  );
}
