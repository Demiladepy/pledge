"""
Fraud Pattern Detection System
Learns from past cheating attempts to catch future fraud
"""

import hashlib
from typing import Dict, Any, List, Optional, TYPE_CHECKING
from datetime import datetime, timedelta
import imagehash
from PIL import Image
import io

from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if TYPE_CHECKING:
    from ..observability.opik_logger import OpikLogger

Base = declarative_base()


class FraudAttempt(Base):
    """Database model for fraud attempts"""
    __tablename__ = 'fraud_attempts'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String, index=True)
    goal_id = Column(String, index=True)
    image_hash = Column(String(64), index=True)
    perceptual_hash = Column(String(64), index=True)
    detected_signals = Column(JSON)
    agent_verdict = Column(String(20))
    timestamp = Column(DateTime, default=datetime.utcnow)


class FraudPattern(Base):
    """Database model for learned patterns"""
    __tablename__ = 'fraud_patterns'
    
    id = Column(Integer, primary_key=True)
    pattern_type = Column(String(50), index=True)
    detection_rule = Column(JSON)
    confidence_threshold = Column(Float)
    times_detected = Column(Integer, default=1)
    last_updated = Column(DateTime, default=datetime.utcnow)


class FraudScore:
    """Container for fraud analysis results"""
    
    def __init__(self, score: float, signals: List[str], details: Dict[str, Any]):
        self.score = score
        self.signals = signals
        self.details = details


class FraudPatternMatcher:
    """
    The agent's learning system.
    
    Every fraud attempt makes the agent smarter.
    Every pattern learned makes detection faster.
    """
    
    def __init__(self, database_url: str, opik_logger: Optional["OpikLogger"] = None):
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.opik = opik_logger
        
    async def analyze(
        self,
        image_data: bytes,
        user_id: str,
        goal_id: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Main fraud detection pipeline.
        
        Checks:
        1. Duplicate image detection (same file submitted before)
        2. Perceptual similarity (slightly modified images)
        3. Metadata forensics (timestamp, GPS, device info)
        4. Temporal anomalies (suspicious submission patterns)
        5. Known fraud patterns (learned from past attempts)
        """
        
        signals = []
        details = {}
        
        # Check 1: Exact duplicate detection
        file_hash = self._compute_file_hash(image_data)
        if self._is_duplicate_hash(file_hash, user_id):
            signals.append("duplicate_image")
            details["duplicate_hash"] = file_hash
        
        # Check 2: Perceptual similarity
        perceptual_hash = self._compute_perceptual_hash(image_data)
        similar_submissions = self._find_similar_images(perceptual_hash, user_id)
        if similar_submissions:
            signals.append("similar_image_detected")
            details["similar_count"] = len(similar_submissions)
        
        # Check 3: Metadata forensics
        metadata_issues = self._check_metadata(metadata)
        if metadata_issues:
            signals.extend(metadata_issues)
            details["metadata_issues"] = metadata_issues
        
        # Check 4: Temporal anomalies
        temporal_flags = await self._check_temporal_patterns(user_id, goal_id)
        if temporal_flags:
            signals.extend(temporal_flags)
            details["temporal_flags"] = temporal_flags
        
        # Check 5: Match against known patterns
        pattern_matches = self._match_known_patterns(signals)
        if pattern_matches:
            signals.append("known_fraud_pattern")
            details["matched_patterns"] = pattern_matches
        
        # Calculate fraud score (0.0 = clean, 1.0 = definitely fraud)
        fraud_score = self._calculate_fraud_score(signals, details)
        
        # Log this attempt for learning
        await self._log_attempt(
            user_id=user_id,
            goal_id=goal_id,
            file_hash=file_hash,
            perceptual_hash=perceptual_hash,
            signals=signals,
            score=fraud_score
        )
        
        # Log to Opik for observability
        if self.opik:
            await self.opik.log_fraud_detection(
                user_id=user_id,
                goal_id=goal_id,
                signals=signals,
                score=fraud_score,
                details=details
            )
        
        return {
            "score": fraud_score,
            "signals": signals,
            "details": details
        }
    
    def _compute_file_hash(self, image_data: bytes) -> str:
        """Compute SHA-256 hash of raw file"""
        return hashlib.sha256(image_data).hexdigest()
    
    def _compute_perceptual_hash(self, image_data: bytes) -> str:
        """
        Compute perceptual hash using imagehash.
        Detects similar images even if slightly modified.
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            phash = imagehash.phash(img)
            return str(phash)
        except Exception:
            return ""
    
    def _is_duplicate_hash(self, file_hash: str, user_id: str) -> bool:
        """Check if this exact file was submitted before"""
        session = self.Session()
        try:
            exists = session.query(FraudAttempt).filter(
                FraudAttempt.user_id == user_id,
                FraudAttempt.image_hash == file_hash
            ).first()
            return exists is not None
        finally:
            session.close()
    
    def _find_similar_images(
        self,
        perceptual_hash: str,
        user_id: str,
        threshold: int = 5
    ) -> List[FraudAttempt]:
        """
        Find images with similar perceptual hashes.
        Uses Hamming distance to detect modified images.
        """
        if not perceptual_hash:
            return []
        
        session = self.Session()
        try:
            past_attempts = session.query(FraudAttempt).filter(
                FraudAttempt.user_id == user_id,
                FraudAttempt.perceptual_hash.isnot(None)
            ).all()
            
            similar = []
            target_hash = imagehash.hex_to_hash(perceptual_hash)
            
            for attempt in past_attempts:
                try:
                    attempt_hash = imagehash.hex_to_hash(attempt.perceptual_hash)
                    distance = target_hash - attempt_hash
                    
                    if distance <= threshold:
                        similar.append(attempt)
                except Exception:
                    continue
            
            return similar
        finally:
            session.close()
    
    def _check_metadata(self, metadata: Dict[str, Any]) -> List[str]:
        """
        Analyze image metadata for red flags.
        
        Red flags:
        - Old timestamp (>24 hours)
        - Missing timestamp
        - GPS location mismatch
        - Same device as flagged user
        """
        issues = []
        
        # Check timestamp
        timestamp = metadata.get("timestamp")
        if timestamp:
            try:
                img_time = datetime.fromisoformat(timestamp)
                age = datetime.utcnow() - img_time
                
                if age > timedelta(hours=24):
                    issues.append("old_photo")
                    issues.append(f"image_age_{int(age.total_seconds() / 3600)}h")
            except Exception:
                issues.append("invalid_timestamp")
        else:
            issues.append("missing_timestamp")
        
        # Check GPS (if provided)
        gps = metadata.get("gps_location")
        expected_location = metadata.get("user_location")
        
        if gps and expected_location:
            # Simplified check - in production, use geopy for distance
            if not self._locations_match(gps, expected_location):
                issues.append("location_mismatch")
        
        return issues
    
    def _locations_match(
        self,
        gps: Dict[str, float],
        expected: Dict[str, float],
        tolerance_km: float = 50.0
    ) -> bool:
        """
        Check if GPS coordinates are within tolerance using Haversine formula.
        Calculates great-circle distance between two points on Earth.
        """
        import math
        
        lat1 = gps.get("latitude", 0)
        lon1 = gps.get("longitude", 0)
        lat2 = expected.get("latitude", 0)
        lon2 = expected.get("longitude", 0)
        
        # Convert latitude and longitude from degrees to radians
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        lon1_rad = math.radians(lon1)
        lon2_rad = math.radians(lon2)
        
        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth radius in kilometers
        R = 6371.0
        
        # Distance in kilometers
        distance_km = R * c
        
        return distance_km <= tolerance_km
    
    async def _check_temporal_patterns(
        self,
        user_id: str,
        goal_id: str
    ) -> List[str]:
        """
        Detect suspicious timing patterns.
        
        Flags:
        - Multiple submissions in short time
        - Submissions at unusual hours
        - Batch submission pattern
        """
        flags = []
        session = self.Session()
        
        try:
            # Check recent submissions
            recent_cutoff = datetime.utcnow() - timedelta(hours=1)
            recent_count = session.query(FraudAttempt).filter(
                FraudAttempt.user_id == user_id,
                FraudAttempt.timestamp > recent_cutoff
            ).count()
            
            if recent_count > 3:
                flags.append("rapid_submissions")
            
            # Check submission hour patterns
            current_hour = datetime.utcnow().hour
            if current_hour < 5 or current_hour > 23:
                flags.append("unusual_hour")
            
        finally:
            session.close()
        
        return flags
    
    def _match_known_patterns(self, signals: List[str]) -> List[str]:
        """
        Match detected signals against learned fraud patterns.
        """
        session = self.Session()
        matches = []
        
        try:
            patterns = session.query(FraudPattern).all()
            
            for pattern in patterns:
                required_signals = pattern.detection_rule.get("signals", [])
                
                if all(sig in signals for sig in required_signals):
                    matches.append(pattern.pattern_type)
        finally:
            session.close()
        
        return matches
    
    def _calculate_fraud_score(
        self,
        signals: List[str],
        details: Dict[str, Any]
    ) -> float:
        """
        Calculate overall fraud probability.
        
        Scoring:
        - Each signal adds weight
        - Some signals are weighted higher
        - Score capped at 1.0
        """
        
        signal_weights = {
            "duplicate_image": 0.4,
            "similar_image_detected": 0.3,
            "old_photo": 0.35,
            "location_mismatch": 0.25,
            "rapid_submissions": 0.2,
            "known_fraud_pattern": 0.5,
            "missing_timestamp": 0.1,
            "unusual_hour": 0.05
        }
        
        score = 0.0
        for signal in signals:
            weight = signal_weights.get(signal, 0.15)  # default weight
            score += weight
        
        return min(score, 1.0)
    
    async def _log_attempt(
        self,
        user_id: str,
        goal_id: str,
        file_hash: str,
        perceptual_hash: str,
        signals: List[str],
        score: float
    ):
        """
        Log this attempt for future pattern learning.
        """
        session = self.Session()
        
        try:
            attempt = FraudAttempt(
                user_id=user_id,
                goal_id=goal_id,
                image_hash=file_hash,
                perceptual_hash=perceptual_hash,
                detected_signals=signals,
                agent_verdict="pending"
            )
            session.add(attempt)
            session.commit()
            
            # If new pattern detected, update pattern database
            if len(signals) >= 2:
                await self._update_patterns(signals)
                
        finally:
            session.close()
    
    async def _update_patterns(self, signals: List[str]):
        """
        Learn new fraud patterns from signal combinations.
        """
        session = self.Session()
        
        try:
            # Check if this combination exists
            pattern_type = "_".join(sorted(signals[:2]))  # Use first 2 signals
            
            existing = session.query(FraudPattern).filter(
                FraudPattern.pattern_type == pattern_type
            ).first()
            
            if existing:
                existing.times_detected += 1
                existing.last_updated = datetime.utcnow()
            else:
                new_pattern = FraudPattern(
                    pattern_type=pattern_type,
                    detection_rule={"signals": signals[:2]},
                    confidence_threshold=0.7,
                    times_detected=1
                )
                session.add(new_pattern)
            
            session.commit()
        finally:
            session.close()
