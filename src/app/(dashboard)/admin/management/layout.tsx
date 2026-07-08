"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const getDefaultTab = () => {
    if (pathname.includes("/admin/management/clients"))
      return "clients";
    if (pathname.includes("/admin/management/inventory"))
      return "inventory";
    return "foods";
  };

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-6">
        <Tabs value={getDefaultTab()}>
          <TabsList>
            <TabsTrigger value="clients" asChild>
              <Link href="/admin/management/clients">
                <Users2Icon />
                Clientes
              </Link>
            </TabsTrigger>
            <TabsTrigger value="inventory" asChild>
              <Link href="/admin/management/inventory">
                <BoxIcon />
                Estoque
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
};

export default Layout;