import Filters from "@/components/filters";
import { getUser } from "@/utils/validation";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = await getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white flex-col gap-12 mx-5 my-3 rounded-lg p-4">
      <Filters />
    </div>
  );
}
