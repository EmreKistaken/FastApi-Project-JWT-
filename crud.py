from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate
from schemas import UserUpdate
from auth import get_password_hash

# Kullanıcı oluşturma
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name, 
        email=user.email, 
        username=user.username,
        hashed_password=hashed_password,
        admin=user.admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Kullanıcı adına göre kullanıcı getirme
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# Email'e göre kullanıcı getirme
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Kullanıcıları listeleme
def get_users(db: Session, skip: int = 0, limit: int = 255):
    return db.query(User).offset(skip).limit(limit).all()

# Kullanıcı silme
def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user 

# Kullanıcı güncelleme
def update_user(db: Session, user_id: int, user_update: UserUpdate):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.email is not None:
        user.email = user_update.email
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.password is not None:
        user.hashed_password = get_password_hash(user_update.password)
    if user_update.admin is not None:
        user.admin = user_update.admin
    db.commit()
    db.refresh(user)
    return user 