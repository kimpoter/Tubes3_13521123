import { authOptions } from "@/app/(backend)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function PrivatePage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      This is private page
      <pre>{JSON.stringify(session)}</pre>
    </div>
  );
}
