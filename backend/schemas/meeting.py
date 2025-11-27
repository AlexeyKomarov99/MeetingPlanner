from pydantic import BaseModel
from datetime import datetime

class MeetingBase(BaseModel):
    title: str
    description: str
    start_time: datetime    
    end_time: datetime      
    location: str           

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: int
    creator_id: int
    created_at: datetime

    class Config:
        from_attributes = True