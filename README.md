# FastAPI Öğrenme Projesi 🚀

Bu proje, FastAPI ile JWT Authentication ve PostgreSQL kullanarak modern bir API geliştirme örneğidir. Proje, Docker Compose ile kolayca ayağa kaldırılabilir ve taşınabilir bir geliştirme ortamı sunar.

## Özellikler

- FastAPI ile hızlı ve modern API geliştirme
- JWT tabanlı kimlik doğrulama
- PostgreSQL veritabanı
- Docker ve Docker Compose ile kolay kurulum
- Swagger (OpenAPI) dokümantasyonu (`/docs`)
- Kullanıcı yönetimi ve authentication endpoint'leri

## Kurulum

### 1. Gerekli Araçlar

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Projeyi Klonla

```bash
git clone https://github.com/EmreKistaken/FastApi-Project-JWT-.git
cd FastApi-Project-JWT-
```

### 3. Docker ile Başlat

```bash
docker-compose up -d
```

- FastAPI: [http://localhost:8000](http://localhost:8000)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- PostgreSQL: localhost:15432 (varsayılan şifre ve kullanıcı için docker-compose.yml dosyasına bakın)

### 4. Test Kullanıcıları Eklemek için

```bash
docker-compose exec app python add_test_users.py
```

## Kullanım

- `/auth/register` : Kullanıcı kaydı
- `/auth/login` : Giriş ve JWT token alma
- `/auth/me` : Token ile kimlik doğrulama
- `/users/` : Kullanıcıları listele
- `/users/protected` : Sadece yetkili kullanıcılar için
- `/users/users/{user_id}` : Kullanıcı silme (DELETE)
- `/users/users/add-test-users/` : Test kullanıcıları ekleme

## Ortam Değişkenleri

`.env.example` dosyasını kopyalayıp `.env` olarak düzenleyebilirsiniz.

## Geliştirme

Kodda değişiklik yaptığınızda, Docker ile hot-reload otomatik olarak devreye girer.

## Katkı

Pull request ve issue’larınızı bekliyorum!

## Lisans

MIT

---

> **Not:** Ana sayfada `{"message": "FastAPI Docker ile çalışıyor!"}` mesajı görüyorsanız, her şey yolunda demektir. 