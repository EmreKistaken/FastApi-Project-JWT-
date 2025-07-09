from fastapi import FastAPI
from routers import user_router, auth_router
from database import Base, engine

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Öğrenme Projesi", description="JWT Authentication ile FastAPI")

app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router.router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "FastAPI Docker ile çalışıyor!"} 