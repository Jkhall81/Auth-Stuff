import { cookies } from "next/headers";
import { auth, signOut } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();
  const cookie = cookies();
  const userObjCookie: any = cookie.get("userObj");
  // const userObj = JSON.parse(userObjCookie.value);
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";

          await cookies().delete("userObj");
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
};

export default SettingsPage;
