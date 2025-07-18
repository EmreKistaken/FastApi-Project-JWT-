from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user_router, auth_router
from database import Base, engine

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Öğrenme Projesi", description="JWT Authentication ile FastAPI")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Gerekirse buraya frontend adresini ekle
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_router.router, prefix="/users", tags=["Users"]) 

@app.get("/")
def root():
    return {"message": "FastAPI Docker ile çalışıyor!"} 