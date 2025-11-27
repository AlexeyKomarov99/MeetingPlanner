from pydantic import BaseModel
from datetime import datetime

class ParticipantBase(BaseModel):
    status: str

class ParticipantUpdate(BaseModel):
    status: str

class ParticipantResponse(ParticipantBase):
    user_id: int
    meeting_id: int
    
    class Config:
        from_attributes = True