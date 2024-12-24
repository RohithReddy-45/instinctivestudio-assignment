import { getUser } from "@/utils/validation";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="container mx-auto justify-center flex max-w-7xl gap-12 items-center h-dvh">{children}</div>
  );
}
