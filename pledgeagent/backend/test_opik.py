"""
Test Opik API key connection
"""

import os
from dotenv import load_dotenv
from observability.opik_logger import OpikLogger

load_dotenv()

def test_opik_connection():
    """Test Opik API key and connection"""
    
    api_key = os.getenv("OPIK_API_KEY", "")
    
    print("=" * 60)
    print("Testing Opik Connection")
    print("=" * 60)
    print(f"API Key: {api_key[:10]}..." if api_key else "No API key found")
    print()
    
    # Initialize Opik logger
    logger = OpikLogger(api_key=api_key)
    
    print(f"Opik Enabled: {logger.enabled}")
    print(f"Dashboard URL: {logger.dashboard_url}")
    print(f"Project Name: {logger.project_name}")
    print()
    
    if logger.enabled:
        print("[OK] Opik is enabled!")
        print(f"   Visit dashboard: {logger.dashboard_url}/{logger.project_name}")
        print()
        
        # Try to log a test trace
        print("Testing trace logging...")
        try:
            import asyncio
            
            async def test_log():
                await logger.log_verification(
                    user_id="test_user",
                    goal_id="test_goal",
                    input_data={"test": "data"},
                    output_data={"verdict": "approved", "confidence": 0.95},
                    metrics={"fraud_score": 0.1, "processing_time_ms": 100},
                    tags=["test", "opik_connection"]
                )
                print("[OK] Test trace logged successfully!")
            
            asyncio.run(test_log())
        except Exception as e:
            print(f"[WARNING] Error logging test trace: {e}")
    else:
        print("[WARNING] Opik is not enabled.")
        if not api_key:
            print("   Check your OPIK_API_KEY in .env file")
        else:
            print("   Opik package may not be installed. Run: pip install opik")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    test_opik_connection()
