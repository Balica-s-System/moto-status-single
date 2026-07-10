"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  BoxIcon,
  ChevronDown,
  ChevronsLeft,
  LogOut,
  Menu,
  PanelLeft,
  ShieldIcon,
  User2Icon,
  Users2Icon,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type RouteGroup = {
  group: string;
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
};

const ROUTE_GROUPS: RouteGroup[] = [
  {
    group: "Administração",
    items: [
      {
        href: "/admin/management/clients",
        label: "Clientes",
        icon: <Users2Icon className="size-4" />,
      },
      {
        href: "/admin/management/inventory",
        label: "Estoque",
        icon: <BoxIcon className="size-4" />,
      },
    ],
  },
  {
    group: "Configurações",
    items: [
      {
        href: "/admin/settings/users",
        label: "Usuários",
        icon: <ShieldIcon className="size-4" />,
      },
    ],
  },
  {
    group: "Conta",
    items: [
      {
        href: "/admin/settings/profile",
        label: "Perfil",
        icon: <User2Icon className="size-4" />,
      },
    ],
  },
];

type DashboardLayoutProps = {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
};

const SIDEBAR_WIDTH = 256;

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userRole = user.role || "user";
  const sidebarRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setSidebarOpen(false);
    };
    onChange(mql);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [pathname, isMobile]);

  // Keyboard: Escape closes mobile sidebar
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Focus trap: keep focus inside mobile sidebar while open
  useEffect(() => {
    if (!mobileOpen || !sidebarRef.current) return;
    const sidebar = sidebarRef.current;
    const focusable = sidebar.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) focusable[0].focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Lock body scroll while mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const filteredRouteGroups = ROUTE_GROUPS.filter((group) => {
    if (userRole === "admin") return true;
    return group.group === "Administração" || group.group === "Conta";
  });

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  }, [isMobile]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Sidebar Header */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <Link
          href="/admin"
          className="flex items-center gap-2.5"
          aria-label="Ir para o painel principal"
        >
          <Image
            src="/logo-auge.png"
            alt=""
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 text-muted-foreground hover:text-foreground touch-target"
          onClick={toggleSidebar}
          aria-label={mobileOpen ? "Fechar menu" : "Recolher menu"}
        >
          {isMobile ? (
            <X className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav
        className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4"
        aria-label="Menu principal"
      >
        <div className="space-y-6">
          {filteredRouteGroups.map((routeGroup) => (
            <SidebarGroup
              key={routeGroup.group}
              group={routeGroup.group}
              items={routeGroup.items}
              currentPath={pathname}
            />
          ))}
        </div>
      </nav>

      <Separator />

      {/* User Section */}
      <div className="shrink-0 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring touch-target"
              aria-label={`Menu do usuário ${user.name}`}
            >
              <Avatar className="size-8 ring-2 ring-border">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-30 hidden border-r bg-sidebar lg:block"
        initial={false}
        animate={{ width: sidebarOpen ? SIDEBAR_WIDTH : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        aria-label="Barra lateral"
        aria-hidden={!sidebarOpen}
      >
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="h-full w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {sidebarContent}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setMobileOpen(false);
                toggleButtonRef.current?.focus();
              }}
              aria-hidden="true"
            />
            <motion.aside
              ref={sidebarRef}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-sidebar shadow-xl lg:hidden"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="flex min-w-0 flex-1 flex-col"
        initial={false}
        animate={{
          marginLeft: !isMobile && sidebarOpen ? SIDEBAR_WIDTH : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur-md sm:px-4">
          {/* Sidebar Toggle */}
          {(!sidebarOpen || isMobile) && (
            <Button
              ref={toggleButtonRef}
              size="icon"
              variant="ghost"
              className="size-9 touch-target"
              onClick={toggleSidebar}
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobile ? mobileOpen : sidebarOpen}
            >
              {isMobile ? (
                <Menu className="size-5" />
              ) : (
                <PanelLeft className="size-4" />
              )}
            </Button>
          )}

          {/* Logo visible when sidebar hidden */}
          {(!sidebarOpen || isMobile) && (
            <Link href="/admin" className="flex items-center" aria-label="Auge Motos - Início">
              <Image
                src="/logo-auge.png"
                alt=""
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </Link>
          )}

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {/* Mobile-only user avatar button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex size-9 items-center justify-center px-0 lg:hidden touch-target"
                  aria-label="Menu do usuário"
                >
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut className="size-4" aria-hidden="true" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="scrollbar-thin flex-1 overflow-y-auto" id="main-content">
          {children}
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;

/* ─── Sidebar Group ─── */

type SidebarGroupProps = {
  group: string;
  items: RouteGroup["items"];
  currentPath: string;
};

const SidebarGroup = ({ group, items, currentPath }: SidebarGroupProps) => {
  return (
    <div role="group" aria-label={group}>
      <p
        className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70"
        aria-hidden="true"
      >
        {group}
      </p>
      <ul className="space-y-0.5" role="list">
        {items.map((item) => {
          const isActive = currentPath.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors touch-target",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-primary"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    aria-hidden="true"
                  />
                )}
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
