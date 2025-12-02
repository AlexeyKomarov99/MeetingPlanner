from pydantic import BaseModel, validator, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
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

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    location_type: Optional[str] = None
    status: Optional[MeetingStatus] = None

# Алиас для PATCH (можно использовать ту же схему)
MeetingPatch = MeetingUpdate

class MeetingResponse(MeetingBase):
    meeting_id: UUID
    creator_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class MeetingDeleteResponse(BaseModel):
    message: str
    deleted_meeting_id: UUID