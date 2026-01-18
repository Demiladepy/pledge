"""
Stake Adjustment System
Learns user behavior and adjusts stakes/messaging accordingly
"""

from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

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
    
    def __init__(self, database_url: str):
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
    
    async def record_success(self, user_id: str, goal_id: str):
        """Record successful proof submission"""
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            # Update metrics
            profile.current_streak += 1
            profile.total_successes += 1
            profile.recent_failures = 0
            profile.last_success_date = datetime.utcnow()
            profile.compassion_mode = False
            
            # Adaptive stake increase on streaks
            if profile.current_streak >= 3:
                old_stake = profile.current_stake
                profile.current_stake = min(old_stake * 1.2, 500.0)  # Cap at $500
                
                # TODO: Send notification about stake increase
                
            session.commit()
            
        finally:
            session.close()
    
    async def record_failure(self, user_id: str, goal_id: str):
        """Record failed/rejected submission"""
        session = self.Session()
        
        try:
            profile = self._get_or_create_profile(session, user_id)
            
            # Update metrics
            profile.current_streak = 0
            profile.total_failures += 1
            profile.recent_failures += 1
            profile.last_failure_date = datetime.utcnow()
            
            # Compassion override after multiple failures
            if profile.recent_failures >= 2:
                profile.compassion_mode = True
                old_stake = profile.current_stake
                profile.current_stake = max(old_stake * 0.8, 10.0)  # Floor at $10
                
                # TODO: Send compassionate message
            
            session.commit()
            
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
            
            # TODO: Check goal deadline from goal_id
            # TODO: Check completion rate
            
            # For now: ultimatum after 3 consecutive failures
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
