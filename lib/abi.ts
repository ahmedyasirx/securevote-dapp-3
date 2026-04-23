export const secureVoteAbi = [
  "function owner() view returns (address)",
  "function electionCount() view returns (uint256)",
  "function getElection(uint256 electionId) view returns ((uint256 id,string title,string description,uint64 startTime,uint64 endTime,uint8 status,bool exists,uint256 candidateCount,uint256 totalVotes))",
  "function getCandidates(uint256 electionId) view returns ((uint256 id,string name,string manifesto,uint256 voteCount)[])",
  "function approveVoter(uint256 electionId, address voter)",
  "function setElectionStatus(uint256 electionId, uint8 status)",
  "function castVote(uint256 electionId, uint256 candidateId)",
  "function createElection(string title,string description,uint64 startTime,uint64 endTime,string[] candidateNames,string[] manifestos) returns (uint256)",
  "function approvedVoters(uint256 electionId, address voter) view returns (bool)",
  "function hasVoted(uint256 electionId, address voter) view returns (bool)"
] as const;
