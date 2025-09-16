import AdminLayout from "@/components/admin/AdminLayout";
import { SignedOut } from "@clerk/nextjs";

export const metadata = {
    title: "GoCart. - Admin",
    description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <><SignedOut
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
