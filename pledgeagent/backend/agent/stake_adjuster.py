"""
Stake Adjustment System
Learns user behavior and adjusts stakes/messaging accordingly
"""

from typing import Optional, Dict, Any, TYPE_CHECKING
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if TYPE_CHECKING:
    from ..observability.opik_logger import OpikLogger

Base = declarative_base()


class UserProfile(Base):
    """User behavioral profile"""
    __tablename__ = 'user_profiles'
    
    user_id = Column(String, primary_key=True)
    current_stake = Column(Float, default=10.0)
    current_streak = Column(Integer, default=0)
    total_successes = Column(Integer, default=0)
    total_failures = Column(Integer, default=0)
    recent_failures = Column(Integer, default=0)
    last_success_date = Column(DateTime)
    last_failure_date = Column(DateTime)
    compassion_mode = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class StakeAdjuster:
    """
    Adaptive behavioral system.
    
    The agent learns:
    - When to push harder (raise stakes)
    - When to show compassion (lower stakes)
    - When to send ultimatums
    """
    
    def __init__(self, database_url: str, opik_logger: Optional["OpikLogger"] = None):
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.opik = opik_logger
    
    async def record_success(self, user_id: str, goal_id: str):
        """Record successful proof submission"""
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            old_stake = profile.current_stake
            
            # Update metrics
            profile.current_streak += 1
            profile.total_successes += 1
            profile.recent_failures = 0
            profile.last_success_date = datetime.utcnow()
            profile.compassion_mode = False
            
            # Adaptive stake increase on streaks
            stake_changed = False
            if profile.current_streak >= 3:
                profile.current_stake = min(old_stake * 1.2, 500.0)  # Cap at $500
                stake_changed = True
                
            session.commit()
            
            # Log stake adjustment to Opik if stake changed
            if stake_changed and self.opik:
                await self.opik.log_stake_adjustment(
                    user_id=user_id,
                    old_stake=old_stake,
                    new_stake=profile.current_stake,
                    reason=f"streak_bonus_{profile.current_streak}"
                )
            
        finally:
            session.close()
    
    async def record_failure(self, user_id: str, goal_id: str):
        """Record failed/rejected submission"""
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            old_stake = profile.current_stake
            
            # Update metrics
            profile.current_streak = 0
            profile.total_failures += 1
            profile.recent_failures += 1
            profile.last_failure_date = datetime.utcnow()
            
            # Compassion override after multiple failures
            stake_changed = False
            if profile.recent_failures >= 2:
                profile.compassion_mode = True
                profile.current_stake = max(old_stake * 0.8, 10.0)  # Floor at $10
                stake_changed = True
            
            session.commit()
            
            # Log stake adjustment to Opik if stake changed
            if stake_changed and self.opik:
                await self.opik.log_stake_adjustment(
                    user_id=user_id,
                    old_stake=old_stake,
                    new_stake=profile.current_stake,
                    reason="compassion_reduction"
                )
            
        finally:
            session.close()
    
    async def get_recommended_stake(self, user_id: str) -> float:
        """Get AI-recommended stake amount for new goals"""
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            # Calculation factors:
            # - Success rate
            # - Current streak
            # - Recent performance
            
            if profile.total_successes + profile.total_failures == 0:
                # New user: start conservative
                return 20.0
            
            success_rate = profile.total_successes / (profile.total_successes + profile.total_failures)
            
            if success_rate > 0.8:
                # High performer: can handle higher stakes
                return min(profile.current_stake * 1.5, 500.0)
            elif success_rate < 0.3:
                # Struggling: reduce stakes
                return max(profile.current_stake * 0.7, 10.0)
            else:
                return profile.current_stake
                
        finally:
            session.close()
    
    async def should_send_ultimatum(self, user_id: str, goal_id: str) -> bool:
        """
        Determine if it's time for an ultimatum message.
        
        Criteria:
        - Goal is close to deadline
        - User is behind on completions
        - Recent failure streak
        """
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            # Check goal deadline and completion rate
            try:
                from ..models import Goal
                goal = session.query(Goal).filter(Goal.goal_id == goal_id).first()
                
                if goal:
                    from datetime import datetime
                    days_remaining = (goal.end_date - datetime.utcnow()).days
                    days_elapsed = (datetime.utcnow() - goal.start_date).days if goal.start_date else 0
                    
                    # Calculate completion rate
                    total_submissions = profile.total_successes + profile.total_failures
                    completion_rate = profile.total_successes / total_submissions if total_submissions > 0 else 0
                    required_rate = goal.required_submissions / goal.duration_days if goal.duration_days > 0 else 0
                    
                    # Trigger ultimatum if:
                    # 1. 3+ consecutive failures, OR
                    # 2. Less than 25% of time remaining AND completion rate below required
                    if profile.recent_failures >= 3:
                        return True
                    
                    if days_remaining > 0 and days_elapsed > 0:
                        time_remaining_pct = days_remaining / goal.duration_days
                        if time_remaining_pct < 0.25 and completion_rate < required_rate * 0.5:
                            return True
            except Exception as e:
                # If goal lookup fails, fall back to failure count
                print(f"⚠️  Could not check goal deadline: {e}")
            
            # Default: ultimatum after 3 consecutive failures
            return profile.recent_failures >= 3
            
        finally:
            session.close()
    
    async def get_motivational_message(
        self,
        user_id: str,
        context: str = "general"
    ) -> str:
        """
        Generate personalized motivational message based on user history.
        """
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            if profile.current_streak >= 5:
                return f"🔥 {profile.current_streak}-day streak. You're unstoppable."
            
            elif profile.recent_failures >= 2 and profile.compassion_mode:
                return "I see you're struggling. Let's take it one day at a time."
            
            elif profile.total_successes > 10:
                return f"You've proven yourself {profile.total_successes} times. Keep going."
            
            else:
                return "Show me what you've got."
                
        finally:
            session.close()
    
    def _get_or_create_profile(self, session, user_id: str) -> UserProfile:
        """Get existing profile or create new one"""
        profile = session.query(UserProfile).filter(
            UserProfile.user_id == user_id
        ).first()
        
        if not profile:
            profile = UserProfile(user_id=user_id)
            session.add(profile)
            session.commit()
        
        return profile
    
    def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get user statistics for dashboard display.
        Returns a dictionary with user metrics.
        """
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            return {
                "user_id": user_id,
                "current_streak": profile.current_streak,
                "total_successes": profile.total_successes,
                "total_failures": profile.total_failures,
                "current_stake": profile.current_stake,
                "compassion_mode": profile.compassion_mode,
                "recent_failures": profile.recent_failures,
                "last_success_date": profile.last_success_date.isoformat() if profile.last_success_date else None,
                "last_failure_date": profile.last_failure_date.isoformat() if profile.last_failure_date else None,
            }
        finally:
            session.close()
