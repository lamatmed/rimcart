import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const metadata = {
  title: "GoCart. - Admin",
  description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <AdminLayout>{children}</AdminLayout>
      </SignedIn>
      ,SignedOut
    </>
  );
}
