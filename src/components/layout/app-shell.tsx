import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Route,
  FileText,
  MapPinned,
  Table2,
  ScrollText,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/chuyen-moi", label: "Tạo chuyến", icon: Plus },
  { to: "/phieu", label: "Phiếu phụ cấp", icon: FileText },
  { to: "/dia-diem", label: "Bản đồ điểm", icon: MapPinned },
  { to: "/dinh-muc", label: "Định mức", icon: Table2 },
  { to: "/quy-che", label: "Quy chế", icon: ScrollText },
] as const;

function GiongVinaEmblem({ className }: { className?: string }) {
  return (
    <img
      src="/giong-vina-logo.png"
      alt="GIONG VINA logo"
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-1">
      <GiongVinaEmblem className="size-12 shadow-sm ring-1 ring-white/5" />
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-sidebar-muted">
          GIONG VINA
        </span>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Giong Route
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const appVersion = useAppStore((state) => state.currentVersion);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pb-6 pt-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.16em] text-sidebar-muted">
          Điều hành
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs leading-relaxed text-sidebar-muted">
          Phụ cấp vận chuyển nội bộ
          <br />
          Theo Quy chế QC-GIONG
        </p>
        <div className="mt-3 rounded-md border border-sidebar-border bg-sidebar-accent/30 px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/80">
          Version {appVersion}
        </div>
      </div>
    </div>
  );
}

function MiniRailNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex w-full flex-col items-center gap-2">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
            aria-label={item.label}
            title={item.label}
          >
            <Icon className="size-4 shrink-0" />
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate().catch((error) => {
      console.error("[app] không tải được dữ liệu máy chủ:", error);
    });
  }, [hydrate]);

  return (
    <div className="flex h-screen min-h-screen overflow-hidden bg-background">
      <div className="no-print hidden h-screen lg:flex">
        <aside className="group relative h-screen w-16 overflow-hidden bg-sidebar transition-[width,box-shadow,transform] duration-300 ease-out hover:w-60 focus-within:w-60 hover:shadow-xl focus-within:shadow-xl">
          <div className="absolute inset-y-0 left-0 flex w-16 flex-col items-center border-r border-sidebar-border bg-sidebar/95 px-2 py-3 shadow-inner shadow-black/10 transition-all duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0">
            <div className="mb-3 flex items-center justify-center">
              <GiongVinaEmblem className="size-8" />
            </div>
            <MiniRailNav />
          </div>

          <div className="absolute inset-y-0 left-0 h-full w-full translate-x-[-12%] opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto pointer-events-none">
            <SidebarBody />
          </div>
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-sm lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="lg:hidden">
            <BrandMark />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/chuyen-moi">
                <Plus className="size-4" />
                Tạo chuyến
              </Link>
            </Button>
            <Button asChild size="icon" className="sm:hidden">
              <Link to="/chuyen-moi" aria-label="Tạo chuyến">
                <Plus className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function BrandMark() {
  return (
    <span className="flex items-center gap-2">
      <GiongVinaEmblem className="size-10" />
      <span className="text-sm font-semibold tracking-tight text-foreground">GIONG VINA</span>
    </span>
  );
}
