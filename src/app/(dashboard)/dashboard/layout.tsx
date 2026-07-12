"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const getDefaultTab = () => {
    if (pathname === "/dashboard") return "overview";
    if (pathname.startsWith("/dashboard/sales")) return "sales";
    if (pathname.startsWith("/dashboard/stock")) return "stock";
    if (pathname.startsWith("/dashboard/clients")) return "clients";
    if (pathname.startsWith("/dashboard/projections")) return "projections";
    return "overview";
  };

  return (
    <div className="space-y-6">
      <Tabs value={getDefaultTab()}>
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href="/dashboard">
              <LayoutDashboard />
              Visão Geral
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sales" asChild>
            <Link href="/dashboard/sales">
              <DollarSign />
              Vendas
            </Link>
          </TabsTrigger>
          <TabsTrigger value="stock" asChild>
            <Link href="/dashboard/stock">
              <Package />
              Estoque
            </Link>
          </TabsTrigger>
          <TabsTrigger value="clients" asChild>
            <Link href="/dashboard/clients">
              <Users />
              Clientes
            </Link>
          </TabsTrigger>
          <TabsTrigger value="projections" asChild>
            <Link href="/dashboard/projections">
              <TrendingUp />
              Projeções
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
