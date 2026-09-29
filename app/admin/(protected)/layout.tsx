import { requireAdminPage } from "@/lib/auth";
import { AdminNav } from "./admin-nav";

// Every page under here also checks the session itself (see requireAdminPage)
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="container-page pt-10 md:pt-14">
      <AdminNav />
      {children}
    </div>
  );
}
