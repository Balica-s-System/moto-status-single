"use client";

import { LifeBuoy, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const getDefaultTab = () => {
    if (pathname.includes("/support/new")) return "new";
    return "list";
  };

  return (
    <div>
      <div className="mb-6">
        <Tabs value={getDefaultTab()}>
          <TabsList>
            <TabsTrigger value="list" asChild>
              <Link href="/support">
                <LifeBuoy />
                Meus Chamados
              </Link>
            </TabsTrigger>
            <TabsTrigger value="new" asChild>
              <Link href="/support/new">
                <MessageSquarePlus />
                Novo Chamado
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
