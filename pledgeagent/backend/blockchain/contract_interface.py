"""
Web3 integration for PledgeEscrow smart contract
Handles all blockchain interactions for goal creation and verification
"""

import os
import json
from typing import Optional, Dict, Any
from web3 import Web3
from web3.middleware import geth_poa_middleware
from eth_account import Account
from pathlib import Path

class ContractInterface:
    """Interface for interacting with PledgeEscrow smart contract"""
    
    def __init__(self):
        """Initialize Web3 connection and contract instance"""
        # Load configuration from environment
        self.rpc_url = os.getenv("RPC_URL", "https://sepolia.base.org")
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        self.chain_id = int(os.getenv("CONTRACT_CHAIN_ID", "84532"))
        self.private_key = os.getenv("AGENT_PRIVATE_KEY")
        
        # Initialize Web3
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Add PoA middleware for Base network
        self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
        
        # Load contract ABI
        self.contract_abi = self._load_contract_abi()
        
        # Initialize contract instance
        if self.contract_address:
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(self.contract_address),
                abi=self.contract_abi
            )
        else:
            self.contract = None
            print("⚠️  Warning: CONTRACT_ADDRESS not set. Contract interactions disabled.")
        
        # Initialize agent account
        if self.private_key:
            self.agent_account = Account.from_key(self.private_key)
            print(f"✅ Agent backend address: {self.agent_account.address}")
        else:
            self.agent_account = None
            print("⚠️  Warning: AGENT_PRIVATE_KEY not set. Cannot sign transactions.")
    
    def _load_contract_abi(self) -> list:
        """Load contract ABI from compiled artifacts"""
        # Try to load from Hardhat artifacts
        artifacts_path = Path(__file__).parent.parent.parent / "contracts" / "artifacts" / "PledgeEscrow.sol" / "PledgeEscrow.json"
        
        if artifacts_path.exists():
            with open(artifacts_path, 'r') as f:
                artifact = json.load(f)
                return artifact['abi']
        
        # Fallback: minimal ABI for core functions
        return [
            {
                "inputs": [{"internalType": "uint256", "name": "goalId", "type": "uint256"}],
                "name": "getGoal",
                "outputs": [
                    {
                        "components": [
                            {"internalType": "address", "name": "user", "type": "address"},
                            {"internalType": "uint256", "name": "stakeAmount", "type": "uint256"},
                            {"internalType": "uint256", "name": "startDate", "type": "uint256"},
                            {"internalType": "uint256", "name": "endDate", "type": "uint256"},
                            {"internalType": "address", "name": "penaltyRecipient", "type": "address"},
                            {"internalType": "bool", "name": "active", "type": "bool"},
                            {"internalType": "uint256", "name": "successfulSubmissions", "type": "uint256"},
                            {"internalType": "uint256", "name": "requiredSubmissions", "type": "uint256"},
                            {"internalType": "string", "name": "goalDescription", "type": "string"},
                            {"internalType": "string", "name": "proofType", "type": "string"}
                        ],
                        "internalType": "struct PledgeEscrow.Goal",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {"internalType": "uint256", "name": "goalId", "type": "uint256"},
                    {"internalType": "bool", "name": "approved", "type": "bool"}
                ],
                "name": "recordVerification",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "goalId", "type": "uint256"}],
                "name": "isGoalSuccessful",
                "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    
    def is_connected(self) -> bool:
        """Check if Web3 connection is active"""
        return self.w3.is_connected()
    
    def get_goal(self, goal_id: int) -> Optional[Dict[str, Any]]:
        """
        Fetch goal details from smart contract
        
        Args:
            goal_id: On-chain goal ID
            
        Returns:
            Dictionary with goal details or None if not found
        """
        if not self.contract:
            return None
        
        try:
            goal = self.contract.functions.getGoal(goal_id).call()
            
            return {
                "user": goal[0],
                "stake_amount": self.w3.from_wei(goal[1], 'ether'),
                "start_date": goal[2],
                "end_date": goal[3],
                "penalty_recipient": goal[4],
                "active": goal[5],
                "successful_submissions": goal[6],
                "required_submissions": goal[7],
                "goal_description": goal[8],
                "proof_type": goal[9]
            }
        except Exception as e:
            print(f"❌ Error fetching goal {goal_id}: {e}")
            return None
    
    def record_verification(self, goal_id: int, approved: bool) -> Optional[str]:
        """
        Record verification result on-chain
        
        Args:
            goal_id: On-chain goal ID
            approved: Whether proof was approved
            
        Returns:
            Transaction hash or None if failed
        """
        if not self.contract or not self.agent_account:
            print("⚠️  Contract or agent account not initialized")
            return None
        
        try:
            # Build transaction
            nonce = self.w3.eth.get_transaction_count(self.agent_account.address)
            
            tx = self.contract.functions.recordVerification(
                goal_id,
                approved
            ).build_transaction({
                'from': self.agent_account.address,
                'nonce': nonce,
                'gas': 100000,
                'maxFeePerGas': self.w3.eth.gas_price * 2,
                'maxPriorityFeePerGas': self.w3.to_wei(1, 'gwei'),
                'chainId': self.chain_id
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print(f"✅ Verification recorded on-chain. TX: {tx_hash.hex()}")
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt['status'] == 1:
                print(f"✅ Transaction confirmed in block {receipt['blockNumber']}")
                return tx_hash.hex()
            else:
                print(f"❌ Transaction failed")
                return None
                
        except Exception as e:
            print(f"❌ Error recording verification: {e}")
            return None
    
    def is_goal_successful(self, goal_id: int) -> Optional[bool]:
        """
        Check if goal has met success criteria
        
        Args:
            goal_id: On-chain goal ID
            
        Returns:
            True if successful, False if not, None if error
        """
        if not self.contract:
            return None
        
        try:
            return self.contract.functions.isGoalSuccessful(goal_id).call()
        except Exception as e:
            print(f"❌ Error checking goal success: {e}")
            return None
    
    def get_agent_balance(self) -> Optional[float]:
        """Get ETH balance of agent backend address"""
        if not self.agent_account:
            return None
        
        try:
            balance_wei = self.w3.eth.get_balance(self.agent_account.address)
            return float(self.w3.from_wei(balance_wei, 'ether'))
        except Exception as e:
            print(f"❌ Error fetching balance: {e}")
            return None
    
    def lock_stake(
        self,
        duration_seconds: int,
        penalty_recipient: str,
        required_submissions: int,
        goal_description: str,
        proof_type: str,
        stake_amount_eth: float,
        user_wallet_address: Optional[str] = None,
        user_private_key: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Lock stake in smart contract to create a goal.
        
        NOTE: This requires the user's wallet to sign the transaction.
        For production, users should call lockStake() directly from frontend.
        This method is for testing/admin purposes.
        
        Args:
            duration_seconds: Goal duration in seconds
            penalty_recipient: Address to receive funds if goal fails
            required_submissions: Minimum proofs needed for success
            goal_description: Human-readable goal description
            proof_type: Type of proof expected (e.g., "photo")
            stake_amount_eth: Amount to lock in ETH
            user_wallet_address: User's wallet address (optional, for simulation)
            user_private_key: User's private key (optional, for testing only)
            
        Returns:
            Dictionary with goal_id and transaction_hash, or None if failed
        """
        if not self.contract:
            print("⚠️  Contract not initialized. Simulating goal creation.")
            # Return simulated result for demo
            return {
                "goal_id": None,  # Will be generated by contract
                "transaction_hash": "0x" + "0" * 64,
                "simulated": True
            }
        
        # If no user wallet provided, return simulation
        if not user_wallet_address or not user_private_key:
            print("⚠️  No user wallet provided. Simulating goal creation.")
            return {
                "goal_id": None,
                "transaction_hash": "0x" + "0" * 64,
                "simulated": True,
                "note": "User must call lockStake() from frontend with their wallet"
            }
        
        try:
            # Convert ETH to wei
            stake_amount_wei = self.w3.to_wei(stake_amount_eth, 'ether')
            
            # Load user account
            user_account = Account.from_key(user_private_key)
            
            # Build transaction
            nonce = self.w3.eth.get_transaction_count(user_account.address)
            
            tx = self.contract.functions.lockStake(
                duration_seconds,
                penalty_recipient,
                required_submissions,
                goal_description,
                proof_type
            ).build_transaction({
                'from': user_account.address,
                'value': stake_amount_wei,
                'nonce': nonce,
                'gas': 200000,  # Higher gas limit for lockStake
                'maxFeePerGas': self.w3.eth.gas_price * 2,
                'maxPriorityFeePerGas': self.w3.to_wei(1, 'gwei'),
                'chainId': self.chain_id
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, user_private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            print(f"✅ Stake locked on-chain. TX: {tx_hash.hex()}")
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            if receipt['status'] == 1:
                # Parse goal_id from events
                goal_id = None
                if receipt.get('logs'):
                    # Try to decode GoalCreated event
                    try:
                        event_abi = [abi for abi in self.contract_abi if abi.get('name') == 'GoalCreated']
                        if event_abi:
                            events = self.contract.events.GoalCreated().process_receipt(receipt)
                            if events:
                                goal_id = events[0]['args']['goalId']
                    except:
                        # Fallback: get goalCounter from contract
                        try:
                            goal_id = self.contract.functions.goalCounter().call()
                        except:
                            pass
                
                print(f"✅ Transaction confirmed in block {receipt['blockNumber']}")
                return {
                    "goal_id": goal_id,
                    "transaction_hash": tx_hash.hex(),
                    "simulated": False
                }
            else:
                print(f"❌ Transaction failed")
                return None
                
        except Exception as e:
            print(f"❌ Error locking stake: {e}")
            return None
    
    def estimate_gas_cost(self) -> Optional[Dict[str, float]]:
        """Estimate gas cost for recording verification"""
        if not self.w3.is_connected():
            return None
        
        try:
            gas_price = self.w3.eth.gas_price
            gas_limit = 100000  # Estimated gas for recordVerification
            
            cost_wei = gas_price * gas_limit
            cost_eth = float(self.w3.from_wei(cost_wei, 'ether'))
            
            return {
                "gas_price_gwei": float(self.w3.from_wei(gas_price, 'gwei')),
                "gas_limit": gas_limit,
                "estimated_cost_eth": cost_eth,
                "estimated_cost_usd": cost_eth * 3000  # Rough ETH price estimate
            }
        except Exception as e:
            print(f"❌ Error estimating gas: {e}")
            return None


# Singleton instance
_contract_interface = None

def get_contract_interface() -> ContractInterface:
    """Get singleton contract interface instance"""
    global _contract_interface
    if _contract_interface is None:
        _contract_interface = ContractInterface()
    return _contract_interface
