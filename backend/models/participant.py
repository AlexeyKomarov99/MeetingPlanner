from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from database.database import Base
import enum
from sqlalchemy.dialects.postgresql import UUID

class ParticipantStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted" 
    DECLINED = "declined"

class Participant(Base):
    __tablename__ = "participants"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), primary_key=True)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey("meetings.meeting_id"), primary_key=True)
    status = Column(Enum(ParticipantStatus), default=ParticipantStatus.PENDING)