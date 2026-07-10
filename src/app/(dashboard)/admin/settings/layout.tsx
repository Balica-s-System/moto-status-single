"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();

  const getDefaultTab = () => {
    if (pathname.includes("/admin/settings/users")) return "users";
    return "users";
  };

  return (
    <div>
      <div className="mb-6">
        <Tabs value={getDefaultTab()}>
          <TabsList>
            <TabsTrigger value="users" asChild>
              <Link href="/admin/management/users">
                <ShieldIcon />
                Usuários
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
