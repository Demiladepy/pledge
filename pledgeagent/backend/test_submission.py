"""
Comprehensive testing script for hackathon submission
Tests all critical functionality end-to-end
"""

import requests
import json
import time
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:8000"
TEST_USER_ID = "hackathon_test_user"
TEST_GOAL_DESC = "Complete 5 push-ups daily for 7 days"

def print_test(name):
    """Print test header"""
    print(f"\n{'='*60}")
    print(f"TEST: {name}")
    print('='*60)

def print_result(success, message):
    """Print test result"""
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status}: {message}")

def test_health():
    """Test 1: Health endpoint"""
    print_test("Backend Health Check")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Backend is operational: {data.get('service')}")
            return True
        else:
            print_result(False, f"Unexpected status: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Connection error: {e}")
        print("   Make sure backend is running: python -m uvicorn api.main:app --reload")
        return False

def test_system_status():
    """Test 2: System status"""
    print_test("System Status Check")
    try:
        response = requests.get(f"{BASE_URL}/api/system/status")
        if response.status_code == 200:
            data = response.json()
            print(f"  Database: {'[OK]' if data.get('database_connected') else '[FAIL]'}")
            print(f"  Blockchain: {'[OK]' if data.get('blockchain_connected') else '[WARN]'}")
            print(f"  Opik: {'[OK]' if data.get('opik_enabled') else '[FAIL]'}")
            print(f"  Gemini: {'[OK]' if data.get('gemini_enabled') else '[FAIL]'}")
            
            if data.get('opik_dashboard_url'):
                print(f"  Opik Dashboard: {data.get('opik_dashboard_url')}")
            
            all_critical = data.get('database_connected') and data.get('opik_enabled') and data.get('gemini_enabled')
            print_result(all_critical, "Critical services status")
            return all_critical
        else:
            print_result(False, f"Status check failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_goal_creation():
    """Test 3: Goal creation"""
    print_test("Goal Creation")
    try:
        payload = {
            "user_id": TEST_USER_ID,
            "description": TEST_GOAL_DESC,
            "proof_type": "photo",
            "stake_amount": 50.0,
            "duration_days": 7,
            "penalty_recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/goals",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            goal_id = data.get('goal_id')
            tx_hash = data.get('transaction_hash')
            
            print(f"  Goal ID: {goal_id}")
            print(f"  Transaction Hash: {tx_hash}")
            
            if goal_id and goal_id.startswith('goal_'):
                print_result(True, f"Goal created successfully: {goal_id}")
                return goal_id
            else:
                print_result(False, "Invalid goal_id format")
                return None
        else:
            print_result(False, f"Goal creation failed: {response.status_code}")
            print(f"  Response: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None

def test_user_stats():
    """Test 4: User stats"""
    print_test("User Stats Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/stats")
        if response.status_code == 200:
            data = response.json()
            print(f"  Total Goals: {data.get('total_goals', 0)}")
            print(f"  Approval Rate: {data.get('approval_rate', 0):.1%}")
            print(f"  Current Streak: {data.get('current_streak', 0)}")
            print(f"  Protocol Rank: {data.get('protocol_rank', 'N/A')}")
            
            # Check if it's real data (not mock)
            is_real = data.get('user_id') == TEST_USER_ID
            print_result(is_real, "Real user data returned (not mock)")
            return is_real
        else:
            print_result(False, f"Stats failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_dashboard_metrics():
    """Test 5: Dashboard metrics"""
    print_test("Dashboard Metrics")
    try:
        response = requests.get(f"{BASE_URL}/api/metrics/dashboard")
        if response.status_code == 200:
            data = response.json()
            print(f"  Total Verifications: {data.get('total_verifications', 0)}")
            print(f"  Approval Rate: {data.get('approval_rate', 0):.1%}")
            print(f"  Opik Enabled: {data.get('opik_enabled', False)}")
            
            if data.get('opik_dashboard_url'):
                print(f"  Opik Dashboard: {data.get('opik_dashboard_url')}")
            
            # Check if Opik is enabled
            opik_enabled = data.get('opik_enabled', False)
            print_result(opik_enabled, "Opik integration active")
            return opik_enabled
        else:
            print_result(False, f"Metrics failed: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_proof_submission(goal_id):
    """Test 6: Proof submission"""
    print_test("Proof Submission")
    
    if not goal_id:
        print_result(False, "No goal_id available (create goal first)")
        return False
    
    # Create a simple test image (1x1 pixel PNG)
    test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
    
    try:
        files = {
            'proof_image': ('test.png', test_image_data, 'image/png')
        }
        data = {
            'user_id': TEST_USER_ID,
            'goal_id': goal_id
        }
        
        print(f"  Submitting proof for goal: {goal_id}")
        print("  (This may take 5-10 seconds for Gemini Vision API...)")
        
        response = requests.post(
            f"{BASE_URL}/api/proof/submit",
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            result = response.json()
            verdict = result.get('verdict', 'unknown')
            confidence = result.get('confidence', 0)
            reasoning = result.get('reasoning', '')[:100]
            
            print(f"  Verdict: {verdict}")
            print(f"  Confidence: {confidence:.1%}")
            print(f"  Reasoning: {reasoning}...")
            
            print_result(True, f"Proof submitted and verified: {verdict}")
            return True
        elif response.status_code == 404:
            print_result(False, f"Goal not found: {goal_id}")
            print("  (This is OK if goal_id from previous test is invalid)")
            return False
        else:
            print_result(False, f"Proof submission failed: {response.status_code}")
            print(f"  Response: {response.text[:200]}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_error_handling():
    """Test 7: Error handling"""
    print_test("Error Handling")
    
    tests = [
        ("Invalid goal_id", lambda: requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/stats")),
        ("Missing goal", lambda: requests.post(f"{BASE_URL}/api/proof/submit", 
            files={'proof_image': ('test.png', b'fake', 'image/png')},
            data={'user_id': TEST_USER_ID, 'goal_id': 'invalid_goal_123'}))
    ]
    
    passed = 0
    for name, test_func in tests:
        try:
            response = test_func()
            if response.status_code in [400, 403, 404]:
                print(f"  [OK] {name}: Correctly returns {response.status_code}")
                passed += 1
            else:
                print(f"  [FAIL] {name}: Unexpected status {response.status_code}")
        except Exception as e:
            print(f"  [WARN] {name}: {e}")
    
    print_result(passed == len(tests), f"Error handling: {passed}/{len(tests)} tests passed")
    return passed == len(tests)

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("HACKATHON SUBMISSION TEST SUITE")
    print("="*60)
    print(f"Testing backend at: {BASE_URL}")
    print(f"Test User ID: {TEST_USER_ID}")
    
    results = {}
    
    # Test 1: Health
    results['health'] = test_health()
    if not results['health']:
        print("\n❌ Backend is not running. Start it first!")
        return
    
    # Test 2: System Status
    results['status'] = test_system_status()
    
    # Test 3: Goal Creation
    goal_id = test_goal_creation()
    results['goal_creation'] = goal_id is not None
    
    # Test 4: User Stats
    results['user_stats'] = test_user_stats()
    
    # Test 5: Dashboard Metrics
    results['metrics'] = test_dashboard_metrics()
    
    # Test 6: Proof Submission (if goal created)
    if goal_id:
        results['proof'] = test_proof_submission(goal_id)
    else:
        print("\n[WARN] Skipping proof submission test (no goal_id)")
        results['proof'] = False
    
    # Test 7: Error Handling
    results['errors'] = test_error_handling()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    for test_name, result in results.items():
        status = "[PASS]" if result else "[FAIL]"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n*** ALL TESTS PASSED - READY FOR SUBMISSION! ***")
    elif passed >= total * 0.7:
        print("\n*** MOSTLY READY - Review failed tests above ***")
    else:
        print("\n*** NOT READY - Fix issues before submission ***")
    
    print("\nNext Steps:")
    print("1. Check Opik dashboard: https://www.comet.com/opik/pledgeagent")
    print("2. Verify traces appear after proof submission")
    print("3. Test frontend integration")
    print("4. Prepare demo video/instructions")

if __name__ == "__main__":
    main()
