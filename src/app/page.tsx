// Landing page at "/" - server component that immediately redirects to /login.
// (Later we can add logic: if logged in -> /dashboard, else /login.)

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
