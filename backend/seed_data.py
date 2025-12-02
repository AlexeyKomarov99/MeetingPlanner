# seed_data.py
import asyncio
from database.database import AsyncSessionLocal
from models.user import User
from models.meeting import Meeting, MeetingStatus
from datetime import datetime, timedelta
import bcrypt
import random

async def create_sample_data():
    async with AsyncSessionLocal() as db:
        try:
            # Очищаем существующие данные
            await db.execute(Meeting.__table__.delete())
            await db.execute(User.__table__.delete())
            await db.commit()

            # Создаем 5 пользователей
            users = []
            for i in range(1, 6):
                user = User(
                    name=f"User",
                    surname=f"{i}",
                    email=f"user{i}@example.com",
                    hashed_password=bcrypt.hashpw(f"password{i}".encode(), bcrypt.gensalt()).decode()
                )
                users.append(user)
                db.add(user)
            
            await db.commit()

            # Создаем встречи
            meetings = []
            statuses = [MeetingStatus.PLANNED, MeetingStatus.ACTIVE, MeetingStatus.COMPLETED, MeetingStatus.CANCELLED, MeetingStatus.POSTPONED]
            location_types = ["office", "cafe", "park", "gym", "home"]
            
            for user in users:
                # По 2 мероприятия каждого статуса = 10 на пользователя
                for status in statuses:
                    for meeting_num in range(1, 3):
                        # Разброс дат: от -14 дней до +14 дней от сегодня
                        days_offset = random.randint(-14, 14)
                        hours_offset = random.randint(9, 18)  # Рабочие часы
                        
                        start_time = datetime.now() + timedelta(days=days_offset, hours=hours_offset)
                        end_time = start_time + timedelta(hours=random.randint(1, 3))
                        
                        meeting = Meeting(
                            title=f"{status.value.capitalize()} встреча {meeting_num}",
                            description=f"Описание {status.value} встречи пользователя {user.name} {user.surname}. Обсуждаем важные вопросы.",
                            start_time=start_time,
                            end_time=end_time,
                            location=f"Локация {meeting_num}",
                            location_type=random.choice(location_types),
                            status=status,
                            creator_id=user.user_id
                        )
                        meetings.append(meeting)
                        db.add(meeting)
            
            await db.commit()
            print(f"✅ Создано {len(users)} пользователей и {len(meetings)} встреч")
            
            # Вывод для проверки
            print("\n📊 Статистика встреч по статусам:")
            for status in statuses:
                count = len([m for m in meetings if m.status == status])
                print(f"  {status.value}: {count} встреч")
                
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(create_sample_data())