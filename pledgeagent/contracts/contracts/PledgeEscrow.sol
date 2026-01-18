// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PledgeEscrow
 * @notice Smart contract for locking stakes and enforcing resolution accountability
 * @dev Uses escrow pattern to hold funds until goal completion or deadline
 */
contract PledgeEscrow {
    
    // ===== STRUCTS =====
    
    struct Goal {
        address user;                   // Goal owner
        uint256 stakeAmount;            // Amount locked in wei
        uint256 startDate;              // Timestamp when goal started
        uint256 endDate;                // Deadline for goal completion
        address penaltyRecipient;       // Where funds go if goal fails
        bool active;                    // Whether goal is still active
        uint256 successfulSubmissions;  // Count of approved proofs
        uint256 requiredSubmissions;    // Minimum proofs needed for success
        string goalDescription;         // Human-readable goal
        string proofType;               // Type of proof expected
    }
    
    // ===== STATE VARIABLES =====
    
    mapping(uint256 => Goal) public goals;
    mapping(address => uint256[]) public userGoals;
    uint256 public goalCounter;
    
    address public agentBackend;        // Authorized backend address
    uint256 public platformFee = 20;    // 2% platform fee (in basis points)
    address public platformTreasury;
    
    // ===== EVENTS =====
    
    event GoalCreated(
        uint256 indexed goalId,
        address indexed user,
        uint256 stakeAmount,
        uint256 endDate,
        string goalDescription
    );
    
    event ProofVerified(
        uint256 indexed goalId,
        bool approved,
        uint256 submissionCount
    );
    
    event StakeReleased(
        uint256 indexed goalId,
        address indexed recipient,
        uint256 amount,
        bool success
    );
    
    event AgentBackendUpdated(address indexed newBackend);
    
    // ===== MODIFIERS =====
    
    modifier onlyAgentBackend() {
        require(msg.sender == agentBackend, "Only agent backend can call this");
        _;
    }
    
    modifier onlyGoalOwner(uint256 goalId) {
        require(goals[goalId].user == msg.sender, "Only goal owner can call this");
        _;
    }
    
    // ===== CONSTRUCTOR =====
    
    constructor(address _agentBackend, address _platformTreasury) {
        agentBackend = _agentBackend;
        platformTreasury = _platformTreasury;
    }
    
    // ===== CORE FUNCTIONS =====
    
    /**
     * @notice Create a new goal and lock stake
     * @param duration Number of seconds until deadline
     * @param penaltyRecipient Address to receive funds if goal fails
     * @param requiredSubmissions Number of successful proofs needed
     * @param goalDescription Human-readable goal description
     * @param proofType Type of proof (e.g., "photo", "screenshot")
     */
    function lockStake(
        uint256 duration,
        address penaltyRecipient,
        uint256 requiredSubmissions,
        string calldata goalDescription,
        string calldata proofType
    ) external payable returns (uint256) {
        require(msg.value >= 0.01 ether, "Minimum stake: 0.01 ETH");
        require(duration >= 7 days, "Minimum duration: 7 days");
        require(duration <= 365 days, "Maximum duration: 365 days");
        require(penaltyRecipient != address(0), "Invalid penalty recipient");
        require(requiredSubmissions > 0, "Must require at least 1 submission");
        
        goalCounter++;
        
        goals[goalCounter] = Goal({
            user: msg.sender,
            stakeAmount: msg.value,
            startDate: block.timestamp,
            endDate: block.timestamp + duration,
            penaltyRecipient: penaltyRecipient,
            active: true,
            successfulSubmissions: 0,
            requiredSubmissions: requiredSubmissions,
            goalDescription: goalDescription,
            proofType: proofType
        });
        
        userGoals[msg.sender].push(goalCounter);
        
        emit GoalCreated(
            goalCounter,
            msg.sender,
            msg.value,
            block.timestamp + duration,
            goalDescription
        );
        
        return goalCounter;
    }
    
    /**
     * @notice Record verification result from agent backend
     * @param goalId ID of the goal
     * @param approved Whether the proof was approved
     */
    function recordVerification(
        uint256 goalId,
        bool approved
    ) external onlyAgentBackend {
        Goal storage goal = goals[goalId];
        require(goal.active, "Goal not active");
        require(block.timestamp <= goal.endDate, "Goal deadline passed");
        
        if (approved) {
            goal.successfulSubmissions++;
        }
        
        emit ProofVerified(goalId, approved, goal.successfulSubmissions);
    }
    
    /**
     * @notice Release stake after goal period ends
     * @param goalId ID of the goal
     */
    function releaseStake(uint256 goalId) external {
        Goal storage goal = goals[goalId];
        require(goal.active, "Goal not active");
        require(block.timestamp >= goal.endDate, "Goal period not ended");
        require(
            msg.sender == goal.user || msg.sender == agentBackend,
            "Unauthorized"
        );
        
        goal.active = false;
        
        uint256 amount = goal.stakeAmount;
        uint256 fee = (amount * platformFee) / 1000;
        uint256 netAmount = amount - fee;
        
        // Transfer platform fee
        if (fee > 0) {
            payable(platformTreasury).transfer(fee);
        }
        
        // Determine recipient based on success
        bool success = goal.successfulSubmissions >= goal.requiredSubmissions;
        address recipient = success ? goal.user : goal.penaltyRecipient;
        
        // Transfer net amount
        payable(recipient).transfer(netAmount);
        
        emit StakeReleased(goalId, recipient, netAmount, success);
    }
    
    /**
     * @notice Emergency withdrawal (only if agent backend fails)
     * @param goalId ID of the goal
     */
    function emergencyWithdraw(uint256 goalId) external onlyGoalOwner(goalId) {
        Goal storage goal = goals[goalId];
        require(goal.active, "Goal not active");
        require(
            block.timestamp >= goal.endDate + 7 days,
            "Emergency withdrawal only available 7 days after deadline"
        );
        
        goal.active = false;
        
        uint256 amount = goal.stakeAmount;
        payable(goal.user).transfer(amount);
        
        emit StakeReleased(goalId, goal.user, amount, false);
    }
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @notice Get goal details
     */
    function getGoal(uint256 goalId) external view returns (Goal memory) {
        return goals[goalId];
    }
    
    /**
     * @notice Get all goals for a user
     */
    function getUserGoals(address user) external view returns (uint256[] memory) {
        return userGoals[user];
    }
    
    /**
     * @notice Check if goal is successful
     */
    function isGoalSuccessful(uint256 goalId) external view returns (bool) {
        Goal memory goal = goals[goalId];
        return goal.successfulSubmissions >= goal.requiredSubmissions;
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @notice Update agent backend address (multisig only in production)
     */
    function updateAgentBackend(address newBackend) external {
        require(msg.sender == agentBackend, "Only current backend");
        agentBackend = newBackend;
        emit AgentBackendUpdated(newBackend);
    }
    
    /**
     * @notice Update platform fee (max 5%)
     */
    function updatePlatformFee(uint256 newFee) external {
        require(msg.sender == platformTreasury, "Only treasury");
        require(newFee <= 50, "Max fee: 5%");
        platformFee = newFee;
    }
}
