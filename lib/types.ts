export type ElectionStatus = 0 | 1 | 2;

export interface Candidate {
  id: number;
  name: string;
  manifesto: string;
  voteCount: number;
}

export interface ElectionSummary {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  status: ElectionStatus;
  candidateCount: number;
  totalVotes: number;
  candidates: Candidate[];
}

export interface AuditRecord {
  timestamp: string;
  action: string;
  wallet?: string;
  electionId?: number;
  details: Record<string, unknown>;
}
