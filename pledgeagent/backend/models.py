"""
Database models for PledgeAgent
Shared models used across the application
"""

from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Goal(Base):
    """Database model for user goals"""
    __tablename__ = 'goals'
    
    id = Column(Integer, primary_key=True)
    goal_id = Column(String(100), unique=True, index=True)  # Unique identifier
    on_chain_goal_id = Column(Integer, nullable=True, index=True)  # On-chain goal ID if created via contract
    user_id = Column(String(100), index=True)
    description = Column(Text, nullable=False)
    proof_type = Column(String(50), default="photo")
    stake_amount = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False)
    penalty_recipient = Column(String(100))  # Ethereum address
    transaction_hash = Column(String(66))  # Blockchain transaction hash
    created_at = Column(DateTime, default=datetime.utcnow)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    active = Column(Boolean, default=True)
    required_submissions = Column(Integer, default=1)  # Minimum proofs needed
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            "goal_id": self.goal_id,
            "on_chain_goal_id": self.on_chain_goal_id,
            "user_id": self.user_id,
            "description": self.description,
            "proof_type": self.proof_type,
            "stake_amount": self.stake_amount,
            "duration_days": self.duration_days,
            "penalty_recipient": self.penalty_recipient,
            "transaction_hash": self.transaction_hash,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "active": self.active,
            "required_submissions": self.required_submissions
        }
