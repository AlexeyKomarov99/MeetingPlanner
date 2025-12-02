from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.meeting import Meeting
from schemas.meeting import MeetingCreate, MeetingResponse, MeetingUpdate, MeetingDeleteResponse

router = APIRouter()

# GET /api/meetings/ - список всех встреч  
@router.get("/", response_model=list[MeetingResponse])
async def get_meetings(db: AsyncSession = Depends(get_db)):
    # Получаем все встречи из БД
    result = await db.execute(select(Meeting))
    meetings = result.scalars().all()
    return meetings

# POST /api/meetings/ - создание встречи
@router.post("/", response_model=MeetingResponse)
async def create_meeting(meeting: MeetingCreate, db: AsyncSession = Depends(get_db)):
    # Создаем встречу (пока creator_id=1 - временно)
    db_meeting = Meeting(**meeting.dict(), creator_id=1)
    db.add(db_meeting)
    await db.commit()
    await db.refresh(db_meeting)
    return db_meeting

# GET /api/meetings/{meeting_id} - детальное описание одного мероприятия
@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

# PUT /api/meetings/{meeting_id} - полное обновление встречи
@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: int,
    meeting_update: MeetingUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    db_meeting = result.scalar_one_or_none()
    
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Обновляем все поля
    update_data = meeting_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_meeting, field, value)
    
    await db.commit()
    await db.refresh(db_meeting)
    return db_meeting

# PATCH /api/meetings/{meeting_id} - частичное обновление встречи
@router.patch("/{meeting_id}", response_model=MeetingResponse)
async def patch_meeting(
    meeting_id: int,
    meeting_patch: MeetingUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    db_meeting = result.scalar_one_or_none()
    
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Обновляем только переданные поля
    update_data = meeting_patch.dict(exclude_unset=True, exclude_none=True)
    
    for field, value in update_data.items():
        setattr(db_meeting, field, value)
    
    await db.commit()
    await db.refresh(db_meeting)
    return db_meeting

# DELETE /api/meetings/{meeting_id} - удаление встречи
@router.delete("/{meeting_id}", response_model=MeetingDeleteResponse)
async def delete_meeting(
    meeting_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.id == meeting_id))
    db_meeting = result.scalar_one_or_none()
    
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Сохраняем ID перед удалением
    deleted_id = db_meeting.id
    
    # Удаляем встречу
    await db.delete(db_meeting)
    await db.commit()
    
    return {
        "message": f"Встреча с ID {meeting_id} успешно удалена",
        "deleted_meeting_id": deleted_id
    }