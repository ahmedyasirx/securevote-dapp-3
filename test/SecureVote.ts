import { expect } from "chai";
import { ethers } from "hardhat";

describe("SecureVote", function () {
  async function deployFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const SecureVote = await ethers.getContractFactory("SecureVote");
    const secureVote = await SecureVote.deploy();
    await secureVote.deployed();

    const latestBlock = await ethers.provider.getBlock("latest");
    const start = latestBlock.timestamp + 10;
    const end = start + 3600;

    await secureVote.createElection(
      "Student Union President",
      "Vote for the new student union president",
      start,
      end,
      ["Alice Khan", "Bilal Rahman"],
      ["Improve campus accessibility", "Increase security training"]
    );

    return { secureVote, owner, voter1, voter2, start };
  }

  it("creates an election with candidates", async function () {
    const { secureVote } = await deployFixture();
    const election = await secureVote.getElection(1);
    const candidates = await secureVote.getCandidates(1);

    expect(election.title).to.equal("Student Union President");
    expect(election.candidateCount).to.equal(2);
    expect(candidates[0].name).to.equal("Alice Khan");
  });

  it("allows an approved voter to cast one vote", async function () {
    const { secureVote, voter1, start } = await deployFixture();

    await secureVote.approveVoter(1, voter1.address);
    await secureVote.setElectionStatus(1, 1);

    await ethers.provider.send("evm_setNextBlockTimestamp", [start + 1]);
    await ethers.provider.send("evm_mine", []);

    await secureVote.connect(voter1).castVote(1, 1);

    const candidate = await secureVote.getCandidate(1, 1);
    expect(candidate.voteCount).to.equal(1);
    expect(await secureVote.hasVoted(1, voter1.address)).to.equal(true);
  });

  it("rejects a second vote from the same voter", async function () {
    const { secureVote, voter1, start } = await deployFixture();

    await secureVote.approveVoter(1, voter1.address);
    await secureVote.setElectionStatus(1, 1);

    await ethers.provider.send("evm_setNextBlockTimestamp", [start + 1]);
    await ethers.provider.send("evm_mine", []);

    await secureVote.connect(voter1).castVote(1, 1);

    await expect(secureVote.connect(voter1).castVote(1, 2)).to.be.revertedWith("Vote already cast");
  });

  it("rejects unapproved voters", async function () {
    const { secureVote, voter2, start } = await deployFixture();

    await secureVote.setElectionStatus(1, 1);

    await ethers.provider.send("evm_setNextBlockTimestamp", [start + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(secureVote.connect(voter2).castVote(1, 1)).to.be.revertedWith("Voter not approved");
  });
});
