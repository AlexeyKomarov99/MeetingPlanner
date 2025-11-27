from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from database.database import Base
import enum

class ParticipantStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted" 
    DECLINED = "declined"

class Participant(Base):
    __tablename__ = "participants"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), primary_key=True) 
    status = Column(Enum(ParticipantStatus), default=ParticipantStatus.PENDING)