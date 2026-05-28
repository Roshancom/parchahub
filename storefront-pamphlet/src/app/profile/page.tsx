import Profile from "@/modules/Profile";
import { getUser } from "@/modules/Profile/services/index.services";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getUser();

  if (user.success) redirect("/");

  return <Profile user={user} />;
}
