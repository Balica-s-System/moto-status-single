import type { Metadata } from "next";
import CpfSearch from "./_components/cpf-search";

export const metadata: Metadata = {
  title: "Buscar Cliente | Auge Motos",
};

const Page = () => <CpfSearch />;

export default Page;
