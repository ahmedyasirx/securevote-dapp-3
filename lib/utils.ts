import { type ElectionStatus, type ElectionSummary } from "@/lib/types";

export function truncateAddress(address?: string | null) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleString();
}

export function statusLabel(status: ElectionStatus) {
  switch (status) {
    case 0:
      return "Draft";
    case 1:
      return "Active";
    case 2:
      return "Closed";
    default:
      return "Unknown";
  }
}

export function statusBadgeClass(status: ElectionStatus) {
  switch (status) {
    case 0:
      return "badge badge-warning";
    case 1:
      return "badge badge-success";
    case 2:
      return "badge badge-neutral";
    default:
      return "badge";
  }
}

export function canVote(election: ElectionSummary) {
  const now = Math.floor(Date.now() / 1000);
  return election.status === 1 && now >= election.startTime && now <= election.endTime;
}

export function parseCandidateLines(input: string) {
  const rows = input
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [name, manifesto] = row.split("|").map((part) => part.trim());
      return { name, manifesto: manifesto ?? "" };
    })
    .filter((row) => row.name);

  return {
    names: rows.map((row) => row.name),
    manifestos: rows.map((row) => row.manifesto || "No manifesto provided")
  };
}
