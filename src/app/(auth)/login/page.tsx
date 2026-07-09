import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "admin") redirect("/admin");
  if (session?.user?.role === "user") redirect("/client");

  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Page;
