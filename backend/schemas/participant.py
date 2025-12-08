from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class ParticipantBase(BaseModel):
    status: str

class ParticipantUpdate(BaseModel):
    status: str

class ParticipantAddSchema(BaseModel):
    user_id: UUID

class ParticipantResponse(BaseModel):
    user_id: UUID
    meeting_id: UUID
    status: str
    user: dict
    
    class Config:
        from_attributes = True