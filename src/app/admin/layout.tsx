// src/app/admin/layout.tsx
import "../globals.css";
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";


export const metadata: Metadata = {
    title: "WWMPS Admin",
    description: "Admin console for What Would My Pastor Say",
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>;
}