# FastAPI + React Kullanıcı Yönetimi Projesi 🚀

Bu proje, FastAPI ile JWT Authentication ve PostgreSQL kullanarak modern bir API ve React tabanlı bir kullanıcı arayüzü örneğidir. Hem backend hem frontend içerir.

## Özellikler
- FastAPI ile hızlı ve modern API
- JWT tabanlı kimlik doğrulama
- PostgreSQL veritabanı
- React ile kullanıcı dostu arayüz
- Admin paneli (sadece admin kullanıcılar erişebilir)
- Kullanıcı yönetimi (kayıt, giriş, listeleme, silme)

## Kurulum

### Gereksinimler
- Python 3.10+
- Node.js (frontend için)
- PostgreSQL

### 1. Backend Kurulumu

```bash
git clone https://github.com/EmreKistaken/FastApi-Project-JWT-.git
cd FastApi-Project-JWT-
python -m venv venv
venv\Scripts\activate  # Windows için
yada
source venv/bin/activate  # Mac/Linux için
pip install -r requirements.txt
```

Veritabanı ayarlarını `.env` dosyasından yapın. Gerekirse örnek dosyayı kopyalayın:
```bash
cp .env.example .env
```

Veritabanını başlatın ve tabloları oluşturun (gerekirse Alembic veya manuel migration kullanın).

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

Frontend arayüzü: [http://localhost:3000](http://localhost:3000)

### 3. Backend'i Başlat

Ana dizinde:
```bash
uvicorn main:app --reload
```

API: [http://localhost:8000](http://localhost:8000)
Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Test Kullanıcıları Eklemek için

```bash
python add_test_users.py
```

## Kullanım
- `/auth/register` : Kullanıcı kaydı
- `/auth/login` : Giriş ve JWT token alma
- `/auth/me` : Token ile kimlik doğrulama
- `/users/` : Kullanıcıları listele
- `/users/users/{user_id}` : Kullanıcı silme (DELETE)

## Admin Paneli Hakkında
- **Admin paneline erişmek için, kullanıcı hesabınızın `admin` alanını veritabanında elle `true` yapmalısınız.**
- Kayıt veya test kullanıcı ekleme işlemlerinde admin yetkisi otomatik verilmez.
- Admin paneli sadece admin kullanıcılar için görünür.

## Geliştirme
Kodda değişiklik yaptığınızda, frontend ve backend otomatik olarak güncellenir (hot-reload).

## Katkı
Pull request ve issue’larınızı bekliyorum!

## Lisans
MIT

---
> **Not:** Ana sayfada `{"message": "FastAPI Docker ile çalışıyor!"}` mesajı görüyorsanız, backend başarıyla çalışıyor demektir. 