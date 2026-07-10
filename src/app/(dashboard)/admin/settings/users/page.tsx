import type { Metadata } from "next";
import { UsersPage } from "./_components/users-page";

export const metadata: Metadata = {
  title: "Usuários | Auge Motos",
};

const Page = () => {
  return <UsersPage />;
};

export default Page;
