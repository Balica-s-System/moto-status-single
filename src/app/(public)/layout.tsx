import { ReactNode } from "react";

type PublicLayoutProps = { children: ReactNode };

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {children}
    </div>
  );
};

export default PublicLayout;
