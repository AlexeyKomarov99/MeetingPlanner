# seed_data.py
import asyncio
from database.database import AsyncSessionLocal
from models.user import User
from models.meeting import Meeting, MeetingStatus
from datetime import datetime, timedelta
import bcrypt

async def create_sample_data():
    async with AsyncSessionLocal() as db:
        try:
            await db.execute(Meeting.__table__.delete())
            await db.execute(User.__table__.delete())
            await db.commit()

            users = []
            for i in range(1, 11):
                user = User(
                    name=f"User",
                    surname=f"{i}",
                    email=f"user{i}@example.com",
                    hashed_password=bcrypt.hashpw(f"password{i}".encode(), bcrypt.gensalt()).decode()
                )
                users.append(user)
                db.add(user)
            
            await db.commit()

            meetings = []
            statuses = [MeetingStatus.PLANNED, MeetingStatus.ACTIVE, MeetingStatus.COMPLETED, MeetingStatus.CANCELLED, MeetingStatus.POSTPONED]
            
            for user in users:
                for j in range(1, 6):
                    start_time = datetime.now() + timedelta(days=j*2, hours=j)
                    meeting = Meeting(
                        title=f"Встреча {j} пользователя {user.name} {user.surname}",
                        description=f"Описание встречи {j}. Обсуждаем важные вопросы.",
                        start_time=start_time,
                        end_time=start_time + timedelta(hours=2),
                        location=f"Офис {j}",
                        location_type="office",
                        status=statuses[(j-1) % 5],
                        creator_id=user.user_id
                    )
                    meetings.append(meeting)
                    db.add(meeting)
            
            await db.commit()
            print(f"✅ Создано {len(users)} пользователей и {len(meetings)} встреч")
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(create_sample_data())