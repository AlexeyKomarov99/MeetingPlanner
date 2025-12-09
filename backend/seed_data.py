import asyncio
from database.database import AsyncSessionLocal
from models.user import User
from models.meeting import Meeting, MeetingStatus
from datetime import datetime, timedelta
import bcrypt
from faker import Faker
from models.participant import Participant, ParticipantStatus
import random

fake = Faker('ru_RU')  # Русские данные

def transliterate(text):
    """Транслитерация кириллицы в латиницу"""
    translit_dict = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    
    result = []
    for char in text.lower():
        if char in translit_dict:
            result.append(translit_dict[char])
        else:
            result.append(char)  # оставляем латинские символы как есть
    
    return ''.join(result)

async def create_sample_data():
    async with AsyncSessionLocal() as db:
        try:
            # Очищаем существующие данные
            await db.execute(Participant.__table__.delete())  
            await db.execute(Meeting.__table__.delete())
            await db.execute(User.__table__.delete())
            await db.commit()

            # Создаем 5 пользователей с реальными именами
            users = []
            real_names = [
                ("Александр", "Иванов"),
                ("Екатерина", "Смирнова"), 
                ("Дмитрий", "Кузнецов"),
                ("Ольга", "Попова"),
                ("Михаил", "Васильев"),
                ("Анна", "Соколова"),       
                ("Сергей", "Михайлов"),     
                ("Наталья", "Новикова"),      
                ("Андрей", "Федоров"),
                ("Мария", "Морозова") 
            ]
            
            for i, (name, surname) in enumerate(real_names, 1):
                user = User(
                    name=name,
                    surname=surname,
                    email=f"{transliterate(name.lower())}.{transliterate(surname.lower())}@example.com",
                    hashed_password=bcrypt.hashpw(f"password{i}".encode(), bcrypt.gensalt()).decode(),
                    user_photo=f"https://i.pravatar.cc/150?img={i+10}"  # аватары
                )
                users.append(user)
                db.add(user)
            
            await db.commit()

            # Создаем встречи
            meetings = []
            statuses = [MeetingStatus.PLANNED, MeetingStatus.ACTIVE, 
                       MeetingStatus.COMPLETED, MeetingStatus.CANCELLED, MeetingStatus.POSTPONED]
            
            # 10 типов мест
            location_types = ["office", "cafe", "park", "gym", "home", 
                             "conference_room", "co_working", "restaurant", 
                             "library", "hotel_lobby"]
            
            # Реальные названия встреч
            meeting_titles = [
                "Совещание по проекту 'Солнце'",
                "Презентация нового продукта",
                "Еженедельный планёр отдела",
                "Переговоры с клиентом из Европы",
                "Мозговой штурм по маркетингу",
                "Обсуждение бюджета на квартал",
                "Онбординг новых сотрудников",
                "Технический обзор архитектуры",
                "Стратегическое планирование",
                "Ретроспектива спринта",
                "Демо-день для инвесторов",
                "Обучение работе с CRM",
                "Координация с дизайн-отделом",
                "Анализ конкурентов",
                "Подготовка к выставке",
                "Обсуждение корпоративной культуры",
                "Планирование командировок",
                "Оценка эффективности рекламы",
                "Встреча с партнёрами",
                "Подведение итогов месяца"
            ]
            
            # Реальные улицы Москвы
            moscow_streets = [
                "ул. Тверская, д. 15",
                "ул. Арбат, д. 25",
                "пр-т Мира, д. 30",
                "ул. Новый Арбат, д. 19",
                "ул. Покровка, д. 22",
                "ул. Большая Дмитровка, д. 11",
                "ул. Маросейка, д. 8",
                "ул. Мясницкая, д. 17",
                "ул. Петровка, д. 23",
                "ул. Кузнецкий Мост, д. 7"
            ]
            
            for user in users:
                # 12-20 встреч на пользователя
                num_meetings = random.randint(12, 20)
                
                for _ in range(num_meetings):
                    # Разброс дат: от -30 дней до +30 дней
                    days_offset = random.randint(-30, 30)
                    hours_offset = random.randint(9, 20)  # С 9 утра до 8 вечера
                    
                    start_time = datetime.now() + timedelta(
                        days=days_offset, 
                        hours=hours_offset,
                        minutes=random.choice([0, 15, 30, 45])
                    )
                    
                    # Длительность 1-4 часа
                    duration = random.randint(1, 4)
                    end_time = start_time + timedelta(hours=duration)
                    
                    # Реальное описание (50+ слов)
                    description = fake.paragraph(nb_sentences=10)  # 10 предложений ≈ 70 слов
                    
                    meeting = Meeting(
                        title=random.choice(meeting_titles),
                        description=description,
                        start_time=start_time,
                        end_time=end_time,
                        location=random.choice(moscow_streets),
                        location_type=random.choice(location_types),
                        status=random.choice(statuses),
                        creator_id=user.user_id
                    )
                    meetings.append(meeting)
                    db.add(meeting)
            
            await db.commit()

            # Берем 20 случайных встреч и делаем их групповыми
            group_meetings = random.sample(meetings, min(20, len(meetings)))

            for meeting in group_meetings:
                # Выбираем 2-5 случайных участников (кроме создателя)
                all_users_except_creator = [u for u in users if u.user_id != meeting.creator_id]
                num_participants = random.randint(2, 5)
                selected_users = random.sample(all_users_except_creator, 
                                            min(num_participants, len(all_users_except_creator)))
                
                for user in selected_users:
                    participant = Participant(
                        meeting_id=meeting.meeting_id,
                        user_id=user.user_id,
                        status=random.choice([ParticipantStatus.PENDING, 
                                            ParticipantStatus.ACCEPTED, 
                                            ParticipantStatus.DECLINED])
                    )
                    db.add(participant)

            await db.commit()

                
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(create_sample_data())