// src/app/admin/users/page.tsx
"use client";
import Table from "@/components/admin/Table";
import { getMockUsers } from "@/lib/admin/mock";


export default function UsersPage() {
    const rows = getMockUsers();
    return (
        <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Users</h2>
            <div className="text-sm text-gray-500">{rows.length} users</div>
        </div>
        <Table
            headers={["Email", "Last Active", "Questions"]}
            rows={rows.map(u => [u.email, new Date(u.lastActive).toLocaleString(), u.questions])}
        />
        </div>
    );
}