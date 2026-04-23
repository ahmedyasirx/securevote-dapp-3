"use client";

import { useState } from "react";

interface AdminPanelProps {
  disabled: boolean;
  onCreateElection: (form: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    candidates: string;
  }) => Promise<void>;
  onApproveVoter: (form: { electionId: string; voter: string }) => Promise<void>;
  onSetStatus: (form: { electionId: string; status: string }) => Promise<void>;
}

export function AdminPanel({ disabled, onCreateElection, onApproveVoter, onSetStatus }: AdminPanelProps) {
  const [createForm, setCreateForm] = useState({
    title: "UEL Student Representative Election",
    description: "A secure on-chain election for elected student leadership.",
    startTime: "",
    endTime: "",
    candidates: "Aisha Malik | Improve accessibility and study support\nHamza Tariq | More labs, hackathons, and networking sessions"
  });
  const [approvalForm, setApprovalForm] = useState({ electionId: "1", voter: "" });
  const [statusForm, setStatusForm] = useState({ electionId: "1", status: "1" });
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleCreateElection(e: React.FormEvent) {
    e.preventDefault();
    setLoadingAction("create");
    try {
      await onCreateElection(createForm);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleApproveVoter(e: React.FormEvent) {
    e.preventDefault();
    setLoadingAction("approve");
    try {
      await onApproveVoter(approvalForm);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSetStatus(e: React.FormEvent) {
    e.preventDefault();
    setLoadingAction("status");
    try {
      await onSetStatus(statusForm);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <section className="card-grid">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-bold text-slate-900">Admin: Create election</h3>
        <p className="mt-2 text-sm text-slate-600">Each candidate should be entered on a new line in the format: Name | manifesto</p>
        <form className="mt-6 space-y-4" onSubmit={handleCreateElection}>
          <input
            className="input input-bordered w-full rounded-2xl"
            placeholder="Election title"
            value={createForm.title}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            className="textarea textarea-bordered h-24 w-full rounded-2xl"
            placeholder="Election description"
            value={createForm.description}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="input input-bordered w-full rounded-2xl"
              type="datetime-local"
              value={createForm.startTime}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, startTime: e.target.value }))}
            />
            <input
              className="input input-bordered w-full rounded-2xl"
              type="datetime-local"
              value={createForm.endTime}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
          <textarea
            className="textarea textarea-bordered h-32 w-full rounded-2xl font-mono text-sm"
            value={createForm.candidates}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, candidates: e.target.value }))}
          />
          <button className="btn btn-primary rounded-2xl" disabled={disabled || loadingAction === "create"}>
            {loadingAction === "create" ? "Submitting..." : "Create election"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-bold text-slate-900">Admin: Approve voter</h3>
          <form className="mt-4 space-y-4" onSubmit={handleApproveVoter}>
            <input
              className="input input-bordered w-full rounded-2xl"
              placeholder="Election ID"
              value={approvalForm.electionId}
              onChange={(e) => setApprovalForm((prev) => ({ ...prev, electionId: e.target.value }))}
            />
            <input
              className="input input-bordered w-full rounded-2xl"
              placeholder="Wallet address"
              value={approvalForm.voter}
              onChange={(e) => setApprovalForm((prev) => ({ ...prev, voter: e.target.value }))}
            />
            <button className="btn btn-secondary rounded-2xl" disabled={disabled || loadingAction === "approve"}>
              {loadingAction === "approve" ? "Approving..." : "Approve voter"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-bold text-slate-900">Admin: Update status</h3>
          <form className="mt-4 space-y-4" onSubmit={handleSetStatus}>
            <input
              className="input input-bordered w-full rounded-2xl"
              placeholder="Election ID"
              value={statusForm.electionId}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, electionId: e.target.value }))}
            />
            <select
              className="select select-bordered w-full rounded-2xl"
              value={statusForm.status}
              onChange={(e) => setStatusForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="0">Draft</option>
              <option value="1">Active</option>
              <option value="2">Closed</option>
            </select>
            <button className="btn btn-accent rounded-2xl" disabled={disabled || loadingAction === "status"}>
              {loadingAction === "status" ? "Updating..." : "Set status"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
