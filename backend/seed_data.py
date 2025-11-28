import asyncio
from database.database import SessionLocal
from models.user import User
from models.meeting import Meeting
from datetime import datetime, timedelta
import bcrypt

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Очищаем существующие данные
        db.query(Meeting).delete()
        db.query(User).delete()
        db.commit()

        # Создаем пользователей
        users = []
        for i in range(1, 11):
            user = User(
                email=f"user{i}@example.com",
                full_name=f"User {i}",
                hashed_password=bcrypt.hashpw(f"password{i}".encode(), bcrypt.gensalt()).decode()
            )
            users.append(user)
            db.add(user)
        
        db.commit()

        # Создаем встречи
        meetings = []
        for user in users:
            for j in range(1, 6):  # По 5 встреч на пользователя
                start_time = datetime.now() + timedelta(days=j*2, hours=j)
                meeting = Meeting(
                    title=f"Встреча {j} пользователя {user.full_name}",
                    description=f"Описание встречи {j}. Обсуждаем важные вопросы.",
                    start_time=start_time,
                    end_time=start_time + timedelta(hours=2),
                    location=f"Офис {j}",
                    creator_id=user.id
                )
                meetings.append(meeting)
                db.add(meeting)
        
        db.commit()
        print(f"✅ Создано {len(users)} пользователей и {len(meetings)} встреч")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()