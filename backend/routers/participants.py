# routers/participants.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from database.database import get_db
from models.user import User
from models.meeting import Meeting
from models.participant import Participant, ParticipantStatus
from schemas.participant import ParticipantAddSchema, ParticipantResponse
from routers.auth import get_current_user

router = APIRouter()

@router.post("/meetings/{meeting_id}/participants", response_model=ParticipantResponse)
async def add_participant(
    meeting_id: UUID,
    participant_data: ParticipantAddSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Проверяем что встреча существует
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Встреча не найдена")
    
    # Проверяем что текущий пользователь - создатель встречи
    if meeting.creator_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Только создатель может добавлять участников")
    
    # Проверяем что добавляемый пользователь существует
    result = await db.execute(
        select(User).where(User.user_id == participant_data.user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Проверяем не добавлен ли уже
    existing = await db.execute(
        select(Participant).where(
            Participant.meeting_id == meeting_id,
            Participant.user_id == participant_data.user_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Пользователь уже добавлен")
    
    # Добавляем участника
    participant = Participant(
        meeting_id=meeting_id,
        user_id=participant_data.user_id,
        status=ParticipantStatus.PENDING
    )
    
    db.add(participant)
    await db.commit()
    await db.refresh(participant)
    
    # Возвращаем с информацией о пользователе
    return {
        "user_id": participant.user_id,
        "meeting_id": participant.meeting_id,
        "status": participant.status.value,
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "user_photo": user.user_photo
        }
    }

@router.get("/meetings/{meeting_id}/participants")
async def get_participants(
    meeting_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    # Проверяем что встреча существует
    result = await db.execute(select(Meeting).where(Meeting.meeting_id == meeting_id))
    meeting = result.scalar_one_or_none()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Встреча не найдена")
    
    # Получаем участников с информацией о пользователях
    result = await db.execute(
        select(Participant, User).join(
            User, Participant.user_id == User.user_id
        ).where(Participant.meeting_id == meeting_id)
    )
    
    participants = result.all()
    return [
        {
            "user_id": user.user_id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
            "user_photo": user.user_photo,
            "status": participant.status.value
        }
        for participant, user in participants
    ]