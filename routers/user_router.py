from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas, auth
import random
from typing import List
from schemas import UserUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: str = Depends(auth.get_current_user)):
    created_user = crud.create_user(db=db, user=user)
    return {
        "message": f"Kullanıcı başarıyla eklendi. ID: {created_user.id}, İsim: {created_user.name}",
        "user": created_user
    }

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: str = Depends(auth.get_current_user)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/protected")
def read_protected_users(current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=current_user)
    if not user or not bool(user.admin):
        raise HTTPException(status_code=403, detail="Bu işlemi yapmak için admin olmalısınız.")
    users = crud.get_users(db, skip=0, limit=10)
    return {
        "message": f"Hoş geldin {current_user}! Bu endpoint sadece admin kullanıcılar için.",
        "current_user": current_user,
        "users": users
    }

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: str = Depends(auth.get_current_user)):
    user = crud.get_user_by_username(db, username=current_user)
    if not user or not bool(user.admin):
        raise HTTPException(status_code=403, detail="Bu işlemi yapmak için admin olmalısınız.")
    user_to_delete = crud.delete_user(db, user_id=user_id)
    if user_to_delete is None:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return {
        "message": f"ID'si {user_id} olan kullanıcı silindi.",
        "user": user_to_delete
    }

@router.patch("/{user_id}")
def admin_update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: str = Depends(auth.get_current_user)):
    user = crud.get_user_by_username(db, username=current_user)
    if not user or not bool(user.admin):
        raise HTTPException(status_code=403, detail="Bu işlemi yapmak için admin olmalısınız.")
    updated_user = crud.update_user(db, user_id=user_id, user_update=user_update)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return {
        "message": f"ID'si {user_id} olan kullanıcı güncellendi.",
        "user": updated_user
    }

@router.post("/users/add-test-users/")
def add_test_users_endpoint(count: int = 100, db: Session = Depends(get_db), current_user: str = Depends(auth.get_current_user)):
    user = crud.get_user_by_username(db, username=current_user)
    if not user or not bool(user.admin):
        raise HTTPException(status_code=403, detail="Bu işlemi yapmak için admin olmalısınız.")
    def generate_random_name():
        first_names = [
            "Ahmet", "Mehmet", "Ali", "Ayşe", "Fatma", "Mustafa", "Hüseyin", "İbrahim",
            "Hasan", "Yusuf", "Murat", "Özlem", "Elif", "Zeynep", "Emine", "Hatice",
            "Meryem", "Sevgi", "Gül", "Can", "Deniz", "Ege", "Berk", "Kaan", "Arda",
            "Efe", "Burak", "Serkan", "Volkan", "Tolga", "Onur", "Uğur", "Serdar",
            "Ömer", "Yasin", "Emre", "Bilal", "İsmail", "Osman", "Halil", "Süleyman"
        ]
        last_names = [
            "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Özkan",
            "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Erdoğan",
            "Koç", "Kurt", "Şen", "Erkan", "Güneş", "Yavuz", "Polat", "Taş", "Korkmaz",
            "Özer", "Güler", "Bozkurt", "Çoban"
        ]
        return f"{random.choice(first_names)} {random.choice(last_names)}"
    def generate_random_email(name):
        email_domains = [
            "gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "live.com",
            "yandex.com", "protonmail.com", "icloud.com", "aol.com", "mail.com"
        ]
        name_parts = name.lower().split()
        if len(name_parts) >= 2:
            email_name = f"{name_parts[0]}.{name_parts[1]}"
        else:
            email_name = name_parts[0]
        random_number = random.randint(1, 999)
        domain = random.choice(email_domains)
        return f"{email_name}{random_number}@{domain}"
    added_count = 0
    added_users = []
    for i in range(count):
        try:
            name = generate_random_name()
            email = generate_random_email(name)
            username = f"user_{i+1}_{random.randint(1000, 9999)}"
            password = f"password_{i+1}"
            user_data = schemas.UserCreate(name=name, email=email, username=username, password=password)
            created_user = crud.create_user(db=db, user=user_data)
            added_count += 1
            added_users.append({
                "id": created_user.id,
                "name": created_user.name,
                "email": created_user.email
            })
        except Exception as e:
            continue
    return {
        "message": f"{added_count} test kullanıcısı başarıyla eklendi! (Ekleyen: {current_user})",
        "added_count": added_count,
        "requested_count": count,
        "users": added_users[:10]
    } 