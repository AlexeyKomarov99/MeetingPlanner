from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from database.database import Base
import enum, uuid
from sqlalchemy.dialects.postgresql import UUID

class MeetingStatus(enum.Enum):
    PLANNED = "planned"
    ACTIVE = "active"
    COMPLETED = "completed" 
    CANCELLED = "cancelled"
    POSTPONED = "postponed"

class Meeting(Base):
    __tablename__ = "meetings"

    meeting_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID, ForeignKey("users.user_id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.PLANNED)
    location = Column(String(100))
    location_type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())