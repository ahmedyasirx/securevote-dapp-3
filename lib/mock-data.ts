import type { ElectionSummary } from "@/lib/types";

const now = Math.floor(Date.now() / 1000);

export const mockElections: ElectionSummary[] = [
  {
    id: 1,
    title: "UEL Student Representative Election",
    description: "Demo dataset shown until you deploy the SecureVote contract and set NEXT_PUBLIC_SECUREVOTE_ADDRESS.",
    startTime: now - 3600,
    endTime: now + 86400,
    status: 1,
    candidateCount: 3,
    totalVotes: 41,
    candidates: [
      { id: 1, name: "Aisha Malik", manifesto: "24/7 quiet study access and stronger disability support.", voteCount: 17 },
      { id: 2, name: "Hamza Tariq", manifesto: "More practical labs and student-led hackathons.", voteCount: 14 },
      { id: 3, name: "Sara Ahmed", manifesto: "Transparent budgeting and better wellbeing events.", voteCount: 10 }
    ]
  }
];
