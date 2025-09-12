// src/components/admin/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
LayoutDashboard, MessageSquare, Users, BookOpen, Search,
ServerCog, Settings, Sparkles
} from "lucide-react";


const NAV = [
{ href: "/admin", label: "Overview", icon: LayoutDashboard },
{ href: "/admin/conversations", label: "Conversations", icon: MessageSquare },
{ href: "/admin/users", label: "Users", icon: Users },
{ href: "/admin/pastors", label: "Pastors & Corpus", icon: BookOpen },
{ href: "/admin/search-logs", label: "Search Logs", icon: Search },
{ href: "/admin/system", label: "System", icon: ServerCog },
{ href: "/admin/settings", label: "Settings", icon: Settings },
];


export default function Sidebar() {
const pathname = usePathname();
return (
<aside className="hidden md:flex md:flex-col w-64 border-r bg-white">
<div className="h-14 px-4 flex items-center border-b">
<div className="flex items-center gap-2 text-indigo-700 font-semibold">
<Sparkles size={18} /> <span>WWMPS Admin</span>
</div>
</div>
<nav className="flex-1 p-2">
{NAV.map(({ href, label, icon: Icon }) => {
const active = pathname === href;
return (
<Link
key={href}
href={href}
className={`flex items-center gap-2 px-3 py-2 rounded-md mb-1 text-sm transition-colors
${active ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100"}`}
>
<Icon size={18} /> {label}
</Link>
);
})}
</nav>
<div className="p-3 text-xs text-gray-500 border-t">v1 • for internal use</div>
</aside>
);
}