import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfilePage } from "./_components/profile-page";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <ProfilePage
      name={session.user.name}
      email={session.user.email}
      image={session.user.image ?? null}
    />
  );
};

export default Page;
