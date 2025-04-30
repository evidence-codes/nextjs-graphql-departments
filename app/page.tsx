import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to departments page from the root
  redirect("/departments")
}
