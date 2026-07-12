import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "./_components/register-form";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role === "admin") redirect("/dashboard");
  if (session?.user?.role === "user") redirect("/dashboard");

  return (
    <div className="flex w-full min-h-screen items-center justify-center">
      <RegisterForm />
    </div>
  );
};

export default Page;
