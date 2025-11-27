from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from models.meeting import Meeting
from schemas.meeting import MeetingCreate, MeetingResponse

router = APIRouter()

# POST /api/meetings/ - создание встречи
@router.post("/", response_model=MeetingResponse)
def create_meeting(meeting: MeetingCreate, db: Session = Depends(get_db)):
    # Создаем встречу (пока creator_id=1 - временно)
    db_meeting = Meeting(**meeting.dict(), creator_id=1)
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

# GET /api/meetings/ - список встреч  
@router.get("/", response_model=list[MeetingResponse])
def get_meetings(db: Session = Depends(get_db)):
    # Получаем все встречи из БД
    meetings = db.query(Meeting).all()
    return meetings