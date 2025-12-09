import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from routers import users, meetings, auth, participants

app = FastAPI(title="Meeting Planner API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])
app.include_router(participants.router, prefix="/api", tags=["participants"])

@app.on_event("startup")
async def startup_event():
    # Создаем таблицы при запуске приложения
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Импортируем seed_data ТОЛЬКО здесь
    from seed_data import create_sample_data
    # Заполняем тестовыми данными
    await create_sample_data()

@app.get("/")
def read_root():
    return {"message": "Meeting Planner API is working!"}