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

# GET /api/meetings/:id - детальное описание одного мероприятия
@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    print(f"🔍 Поиск встречи с ID: {meeting_id}")  # ← ДОБАВЬ
    
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    
    print(f"📊 Найдена встреча: {meeting}")  # ← ДОБАВЬ
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting