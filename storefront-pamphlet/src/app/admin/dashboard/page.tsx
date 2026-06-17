"use client";

import { useState } from "react";
import CreatePamphlet from "@/modules/Profile/components/CreatePamphlet";
import PamphletHistory from "@/modules/Profile/components/PamphletHistory";

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<"create" | "history">(
    "create",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your pamphlets — create, edit, and track your content.
        </p>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 pb-0">
        <button
          onClick={() => setActiveSection("create")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${
            activeSection === "create"
              ? "bg-white text-brand-blue border border-neutral-200 border-b-white -mb-px"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          Create Pamphlet
        </button>
        <button
          onClick={() => setActiveSection("history")}
          className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${
            activeSection === "history"
              ? "bg-white text-brand-blue border border-neutral-200 border-b-white -mb-px"
              : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          Pamphlet History
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        {activeSection === "create" && (
          <CreatePamphlet
            pamphletToEdit={null}
            onPamphletCreated={() => setActiveSection("history")}
          />
        )}
        {activeSection === "history" && <PamphletHistory />}
      </div>
    </div>
  );
}
