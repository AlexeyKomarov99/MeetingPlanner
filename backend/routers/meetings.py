from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.meeting import Meeting
from schemas.meeting import MeetingCreate, MeetingResponse, MeetingUpdate, MeetingDeleteResponse
from uuid import UUID
from routers.auth import get_current_user
from models.user import User
from datetime import datetime, timezone

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
async def create_meeting(
    meeting: MeetingCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Удаляем timezone info
    meeting_data = meeting.dict()
    if meeting_data['start_time'].tzinfo is not None:
        meeting_data['start_time'] = meeting_data['start_time'].replace(tzinfo=None)
    if meeting_data['end_time'].tzinfo is not None:
        meeting_data['end_time'] = meeting_data['end_time'].replace(tzinfo=None)
    
    db_meeting = Meeting(**meeting_data, creator_id=current_user.user_id)
    db.add(db_meeting)
    await db.commit()
    await db.refresh(db_meeting)
    return db_meeting

# GET /api/meetings/{meeting_id} - детальное описание одного мероприятия
@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
    meeting = result.scalar_one_or_none()

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

# PUT /api/meetings/{meeting_id} - полное обновление встречи
@router.put("/{meeting_id}", response_model=MeetingResponse)
async def update_meeting(
    meeting_id: UUID,
    meeting_update: MeetingUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
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
    meeting_id: UUID,
    meeting_patch: MeetingUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
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
    meeting_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
    db_meeting = result.scalar_one_or_none()
    
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Сохраняем ID перед удалением
    deleted_id = db_meeting.meeting_id
    
    # Удаляем встречу
    await db.delete(db_meeting)
    await db.commit()
    
    return {
        "message": f"Встреча с ID {meeting_id} успешно удалена",
        "deleted_meeting_id": deleted_id
    }