from fastapi import FastAPI
from database.database import engine, Base
from routers import users, meetings

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Meeting Planner API")

# Подключаем роутеры
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(meetings.router, prefix="/api/meetings", tags=["meetings"])

@app.get("/")
def read_root():
    return {"message": "Meeting Planner API is working!"}