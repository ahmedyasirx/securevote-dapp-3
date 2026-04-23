"use client";

import type { ElectionSummary } from "@/lib/types";
import { canVote, formatDate, statusBadgeClass, statusLabel } from "@/lib/utils";

interface ElectionCardProps {
  election: ElectionSummary;
  onVote: (electionId: number, candidateId: number) => Promise<void>;
  voteDisabled: boolean;
}

export function ElectionCard({ election, onVote, voteDisabled }: ElectionCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">{election.title}</h3>
            <span className={statusBadgeClass(election.status)}>{statusLabel(election.status)}</span>
          </div>
          <p className="mt-3 text-slate-600">{election.description}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          <div>Election ID: {election.id}</div>
          <div>Total votes: {election.totalVotes}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-100 p-3">Starts: {formatDate(election.startTime)}</div>
        <div className="rounded-2xl bg-slate-100 p-3">Ends: {formatDate(election.endTime)}</div>
        <div className="rounded-2xl bg-slate-100 p-3">Candidates: {election.candidateCount}</div>
      </div>

      <div className="mt-6 space-y-4">
        {election.candidates.map((candidate) => (
          <div key={candidate.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{candidate.name}</h4>
                <p className="mt-2 text-sm text-slate-600">{candidate.manifesto}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="badge badge-outline">Votes: {candidate.voteCount}</span>
                <button
                  className="btn btn-sm btn-primary rounded-xl"
                  onClick={() => onVote(election.id, candidate.id)}
                  disabled={voteDisabled || !canVote(election)}
                >
                  Cast vote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
