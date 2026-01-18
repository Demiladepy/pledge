const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PledgeEscrow", function () {
    let pledgeEscrow;
    let owner, user, agentBackend, treasury, penaltyRecipient;

    beforeEach(async function () {
        [owner, user, agentBackend, treasury, penaltyRecipient] = await ethers.getSigners();

        const PledgeEscrow = await ethers.getContractFactory("PledgeEscrow");
        pledgeEscrow = await PledgeEscrow.deploy(agentBackend.address, treasury.address);
        await pledgeEscrow.waitForDeployment();
    });

    describe("Goal Creation", function () {
        it("Should create a goal and lock stake", async function () {
            const stakeAmount = ethers.parseEther("0.1");
            const duration = 30 * 24 * 60 * 60; // 30 days

            const tx = await pledgeEscrow.connect(user).lockStake(
                duration,
                penaltyRecipient.address,
                4, // required submissions
                "Go to gym 4 times per week",
                "photo",
                { value: stakeAmount }
            );

            await expect(tx)
                .to.emit(pledgeEscrow, "GoalCreated")
                .withArgs(1, user.address, stakeAmount, await time.latest() + duration, "Go to gym 4 times per week");

            const goal = await pledgeEscrow.getGoal(1);
            expect(goal.user).to.equal(user.address);
            expect(goal.stakeAmount).to.equal(stakeAmount);
            expect(goal.active).to.be.true;
        });

        it("Should reject stake below minimum", async function () {
            const stakeAmount = ethers.parseEther("0.005");
            const duration = 30 * 24 * 60 * 60;

            await expect(
                pledgeEscrow.connect(user).lockStake(
                    duration,
                    penaltyRecipient.address,
                    1,
                    "Test goal",
                    "photo",
                    { value: stakeAmount }
                )
            ).to.be.revertedWith("Minimum stake: 0.01 ETH");
        });

        it("Should reject duration below minimum", async function () {
            const stakeAmount = ethers.parseEther("0.1");
            const duration = 5 * 24 * 60 * 60; // 5 days

            await expect(
                pledgeEscrow.connect(user).lockStake(
                    duration,
                    penaltyRecipient.address,
                    1,
                    "Test goal",
                    "photo",
                    { value: stakeAmount }
                )
            ).to.be.revertedWith("Minimum duration: 7 days");
        });
    });

    describe("Proof Verification", function () {
        let goalId;

        beforeEach(async function () {
            const stakeAmount = ethers.parseEther("0.1");
            const duration = 30 * 24 * 60 * 60;

            const tx = await pledgeEscrow.connect(user).lockStake(
                duration,
                penaltyRecipient.address,
                4,
                "Test goal",
                "photo",
                { value: stakeAmount }
            );

            goalId = 1;
        });

        it("Should record approved verification", async function () {
            await expect(
                pledgeEscrow.connect(agentBackend).recordVerification(goalId, true)
            ).to.emit(pledgeEscrow, "ProofVerified")
                .withArgs(goalId, true, 1);

            const goal = await pledgeEscrow.getGoal(goalId);
            expect(goal.successfulSubmissions).to.equal(1);
        });

        it("Should not increment on rejected verification", async function () {
            await pledgeEscrow.connect(agentBackend).recordVerification(goalId, false);

            const goal = await pledgeEscrow.getGoal(goalId);
            expect(goal.successfulSubmissions).to.equal(0);
        });

        it("Should only allow agent backend to record verification", async function () {
            await expect(
                pledgeEscrow.connect(user).recordVerification(goalId, true)
            ).to.be.revertedWith("Only agent backend can call this");
        });
    });

    describe("Stake Release", function () {
        let goalId;
        const stakeAmount = ethers.parseEther("0.1");

        beforeEach(async function () {
            const duration = 30 * 24 * 60 * 60;

            await pledgeEscrow.connect(user).lockStake(
                duration,
                penaltyRecipient.address,
                4,
                "Test goal",
                "photo",
                { value: stakeAmount }
            );

            goalId = 1;
        });

        it("Should release stake to user on success", async function () {
            // Record 4 successful verifications
            for (let i = 0; i < 4; i++) {
                await pledgeEscrow.connect(agentBackend).recordVerification(goalId, true);
            }

            // Fast forward past deadline
            await time.increase(31 * 24 * 60 * 60);

            const userBalanceBefore = await ethers.provider.getBalance(user.address);

            await pledgeEscrow.connect(user).releaseStake(goalId);

            const userBalanceAfter = await ethers.provider.getBalance(user.address);
            const expectedAmount = stakeAmount * 98n / 100n; // 2% fee

            // User should receive ~98% of stake (minus gas)
            expect(userBalanceAfter).to.be.gt(userBalanceBefore);
        });

        it("Should release stake to penalty recipient on failure", async function () {
            // Record only 2 successful verifications (need 4)
            await pledgeEscrow.connect(agentBackend).recordVerification(goalId, true);
            await pledgeEscrow.connect(agentBackend).recordVerification(goalId, true);

            // Fast forward past deadline
            await time.increase(31 * 24 * 60 * 60);

            const recipientBalanceBefore = await ethers.provider.getBalance(penaltyRecipient.address);

            await pledgeEscrow.connect(user).releaseStake(goalId);

            const recipientBalanceAfter = await ethers.provider.getBalance(penaltyRecipient.address);
            const expectedAmount = stakeAmount * 98n / 100n; // 2% fee

            expect(recipientBalanceAfter - recipientBalanceBefore).to.equal(expectedAmount);
        });

        it("Should not allow release before deadline", async function () {
            await expect(
                pledgeEscrow.connect(user).releaseStake(goalId)
            ).to.be.revertedWith("Goal period not ended");
        });
    });

    describe("Emergency Withdrawal", function () {
        it("Should allow emergency withdrawal after grace period", async function () {
            const stakeAmount = ethers.parseEther("0.1");
            const duration = 30 * 24 * 60 * 60;

            await pledgeEscrow.connect(user).lockStake(
                duration,
                penaltyRecipient.address,
                4,
                "Test goal",
                "photo",
                { value: stakeAmount }
            );

            // Fast forward past deadline + 7 days
            await time.increase(38 * 24 * 60 * 60);

            const userBalanceBefore = await ethers.provider.getBalance(user.address);

            await pledgeEscrow.connect(user).emergencyWithdraw(1);

            const userBalanceAfter = await ethers.provider.getBalance(user.address);
            expect(userBalanceAfter).to.be.gt(userBalanceBefore);
        });
    });
});
