from pydantic import BaseModel, validator
from uuid import UUID
from datetime import datetime
from models.meeting import MeetingStatus

class MeetingBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    location: str
    location_type: str
    status: MeetingStatus = MeetingStatus.PLANNED

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    meeting_id: UUID
    creator_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True