import { ReactNode } from "react";

type LegalLayoutProps = { children: ReactNode };

const LegalLayout = ({ children }: LegalLayoutProps) => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {children}
    </div>
  );
};

export default LegalLayout;
