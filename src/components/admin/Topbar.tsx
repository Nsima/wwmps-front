// src/components/admin/Topbar.tsx
"use client";
import { HelpCircle } from "lucide-react";


export default function Topbar({ pathname }: { pathname: string }) {
const title =
pathname === "/admin" ? "Overview"
: pathname.split("/").pop()?.replace(/-/g, " ")?.replace(/\b\w/g, c => c.toUpperCase()) || "";


return (
<div className="h-14 sticky top-0 bg-white/80 backdrop-blur border-b flex items-center">
<div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex items-center justify-between">
<h1 className="text-lg font-semibold">{title}</h1>
<button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">
<HelpCircle size={16} /> Help
</button>
</div>
</div>
);
}