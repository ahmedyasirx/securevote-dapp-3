// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVote is Ownable {
    enum ElectionStatus {
        Draft,
        Active,
        Closed
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        uint64 startTime;
        uint64 endTime;
        ElectionStatus status;
        bool exists;
        uint256 candidateCount;
        uint256 totalVotes;
    }

    struct Candidate {
        uint256 id;
        string name;
        string manifesto;
        uint256 voteCount;
    }

    uint256 public electionCount;

    mapping(uint256 => Election) private elections;
    mapping(uint256 => mapping(uint256 => Candidate)) private candidates;
    mapping(uint256 => mapping(address => bool)) public approvedVoters;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ElectionCreated(uint256 indexed electionId, string title, uint64 startTime, uint64 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event VoterApproved(uint256 indexed electionId, address indexed voter);
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);
    event ElectionStatusUpdated(uint256 indexed electionId, ElectionStatus status);

    constructor() Ownable(msg.sender) {}

    function createElection(
        string calldata title,
        string calldata description,
        uint64 startTime,
        uint64 endTime,
        string[] calldata candidateNames,
        string[] calldata manifestos
    ) external onlyOwner returns (uint256 electionId) {
        require(bytes(title).length > 0, "Title is required");
        require(startTime < endTime, "Invalid schedule");
        require(candidateNames.length > 1, "At least two candidates required");
        require(candidateNames.length == manifestos.length, "Candidate data mismatch");

        electionId = ++electionCount;

        Election storage election = elections[electionId];
        election.id = electionId;
        election.title = title;
        election.description = description;
        election.startTime = startTime;
        election.endTime = endTime;
        election.status = ElectionStatus.Draft;
        election.exists = true;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            uint256 candidateId = i + 1;
            candidates[electionId][candidateId] = Candidate({
                id: candidateId,
                name: candidateNames[i],
                manifesto: manifestos[i],
                voteCount: 0
            });
            election.candidateCount++;
            emit CandidateAdded(electionId, candidateId, candidateNames[i]);
        }

        emit ElectionCreated(electionId, title, startTime, endTime);
    }

    function approveVoter(uint256 electionId, address voter) public onlyOwner {
        require(elections[electionId].exists, "Election not found");
        require(voter != address(0), "Invalid voter");
        approvedVoters[electionId][voter] = true;
        emit VoterApproved(electionId, voter);
    }

    function approveVoters(uint256 electionId, address[] calldata voters) external onlyOwner {
        for (uint256 i = 0; i < voters.length; i++) {
            approveVoter(electionId, voters[i]);
        }
    }

    function setElectionStatus(uint256 electionId, ElectionStatus status) external onlyOwner {
        require(elections[electionId].exists, "Election not found");
        elections[electionId].status = status;
        emit ElectionStatusUpdated(electionId, status);
    }

    function castVote(uint256 electionId, uint256 candidateId) external {
        Election storage election = elections[electionId];
        require(election.exists, "Election not found");
        require(election.status == ElectionStatus.Active, "Election is not active");
        require(block.timestamp >= election.startTime, "Election has not started");
        require(block.timestamp <= election.endTime, "Election has ended");
        require(approvedVoters[electionId][msg.sender], "Voter not approved");
        require(!hasVoted[electionId][msg.sender], "Vote already cast");
        require(candidateId > 0 && candidateId <= election.candidateCount, "Candidate not found");

        hasVoted[electionId][msg.sender] = true;
        candidates[electionId][candidateId].voteCount += 1;
        election.totalVotes += 1;

        emit VoteCast(electionId, candidateId, msg.sender);
    }

    function getElection(uint256 electionId) external view returns (Election memory) {
        require(elections[electionId].exists, "Election not found");
        return elections[electionId];
    }

    function getCandidates(uint256 electionId) external view returns (Candidate[] memory) {
        Election storage election = elections[electionId];
        require(election.exists, "Election not found");

        Candidate[] memory result = new Candidate[](election.candidateCount);
        for (uint256 i = 0; i < election.candidateCount; i++) {
            result[i] = candidates[electionId][i + 1];
        }
        return result;
    }

    function getCandidate(uint256 electionId, uint256 candidateId) external view returns (Candidate memory) {
        require(elections[electionId].exists, "Election not found");
        require(candidateId > 0 && candidateId <= elections[electionId].candidateCount, "Candidate not found");
        return candidates[electionId][candidateId];
    }
}
