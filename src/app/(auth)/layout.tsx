import { ReactNode } from "react";

type AuthLayoutProps = { children: ReactNode };

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      {children}
    </div>
  );
};

export default AuthLayout;
