import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };

const Layout = async ({ children }: LayoutProps) => {

  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</div>;
};

export default Layout;
