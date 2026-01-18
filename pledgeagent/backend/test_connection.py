import sys
import os

# Add current directory to sys.path so we can import from 'blockchain'
sys.path.append(os.getcwd())

from dotenv import load_dotenv
load_dotenv()

from blockchain.contract_interface import get_contract_interface

def test():
    print("Testing connection...")
    try:
        contract = get_contract_interface()
        print(f"Connected: {contract.is_connected()}")
        print(f"Agent balance: {contract.get_agent_balance()} ETH")
        print("✅ Connection Successful!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test()
