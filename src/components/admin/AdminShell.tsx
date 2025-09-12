// src/components/admin/AdminShell.tsx
"use client";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePathname } from "next/navigation";


export default function AdminShell({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
return (
<div className="h-screen w-full bg-gray-50 flex text-gray-900">
<Sidebar />
<div className="flex-1 min-w-0 flex flex-col">
<Topbar pathname={pathname} />
<main className="p-4 md:p-6 overflow-auto">
<div className="max-w-7xl mx-auto">{children}</div>
</main>
</div>
</div>
);
}