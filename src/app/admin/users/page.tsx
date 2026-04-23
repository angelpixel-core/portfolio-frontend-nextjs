import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import userModel from "@/domains/user/model";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin users | Angel Pixel",
  description: "Internal user and access overview.",
};

const formatDateTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

export default async function AdminUsersPage(): Promise<React.JSX.Element> {
  await requireAdmin();
  const users = await userModel.listForAdmin(300);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-sm opacity-80">
          Internal view of users, orders, and granted access records.
        </p>
      </header>

      {users.length === 0 ? (
        <section className="mt-8 rounded-lg border border-dark/20 p-6 dark:border-light/20">
          <p className="text-base opacity-80">No users yet.</p>
        </section>
      ) : (
        <section className="mt-8 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-dark/10 dark:bg-light/10">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Paid</th>
                <th className="px-4 py-3 font-semibold">Access</th>
                <th className="px-4 py-3 font-semibold">Last order</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {users.map((targetUser) => (
                <tr
                  key={targetUser.id}
                  className="border-t border-dark/10 dark:border-light/10"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{targetUser.email}</div>
                    <div className="font-mono text-xs opacity-70">
                      {targetUser.id}
                    </div>
                    <div className="text-xs opacity-70">{targetUser.name}</div>
                  </td>
                  <td className="px-4 py-3">{targetUser.ordersCount}</td>
                  <td className="px-4 py-3">{targetUser.paidOrdersCount}</td>
                  <td className="px-4 py-3">{targetUser.accessCount}</td>
                  <td className="px-4 py-3">
                    {targetUser.lastOrderAt
                      ? formatDateTime(targetUser.lastOrderAt)
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateTime(targetUser.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${targetUser.id}`}
                      className="underline underline-offset-4"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
