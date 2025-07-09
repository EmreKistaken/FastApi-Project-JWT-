# FastAPI Docker Deployment

Bu proje FastAPI uygulamasını Docker Compose ile çalıştırmak için yapılandırılmıştır.

## Gereksinimler

- Docker
- Docker Compose

## Hızlı Başlangıç

### 1. Uygulamayı Başlatma

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları görüntüle
docker-compose logs -f
```

### 2. Uygulamaya Erişim

- **FastAPI Uygulaması:** http://localhost:8000
- **API Dokümantasyonu:** http://localhost:8000/docs
- **PostgreSQL Veritabanı:** localhost:5432

### 3. Test Kullanıcıları Ekleme

```bash
# Container'a bağlan
docker-compose exec app python add_test_users.py
```

## Docker Komutları

### Servisleri Yönetme

```bash
# Servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Servisleri yeniden başlat
docker-compose restart

# Logları görüntüle
docker-compose logs -f app

# Container'a bağlan
docker-compose exec app bash
```

### Veritabanı İşlemleri

```bash
# PostgreSQL container'ına bağlan
docker-compose exec db psql -U postgres -d postgres

# Veritabanı yedekleme
docker-compose exec db pg_dump -U postgres postgres > backup.sql

# Veritabanı geri yükleme
docker-compose exec -T db psql -U postgres -d postgres < backup.sql
```

## Yapılandırma

### Environment Variables

`docker-compose.yml` dosyasında şu environment variable'ları değiştirebilirsiniz:

- `POSTGRES_PASSWORD`: PostgreSQL şifresi
- `POSTGRES_USER`: PostgreSQL kullanıcı adı
- `POSTGRES_DB`: PostgreSQL veritabanı adı

### Port Yapılandırması

- **FastAPI:** 8000 (host) → 8000 (container)
- **PostgreSQL:** 5432 (host) → 5432 (container)

## Geliştirme

### Hot Reload

Uygulama `--reload` flag'i ile çalıştırılıyor, bu sayede kod değişiklikleri otomatik olarak yansır.

### Volume Mounting

Kod dosyaları volume ile mount edilmiştir, bu sayede:
- Kod değişiklikleri anında container'a yansır
- Geliştirme sırasında container'ı yeniden build etmeye gerek yok

## Production Deployment

Production ortamı için:

1. `--reload` flag'ini kaldırın
2. Environment variable'ları güvenli bir şekilde yönetin
3. SSL/TLS sertifikaları ekleyin
4. Reverse proxy (nginx) kullanın
5. Monitoring ve logging ekleyin

## Sorun Giderme

### Veritabanı Bağlantı Sorunu

```bash
# Veritabanı servisinin durumunu kontrol et
docker-compose ps

# Veritabanı loglarını görüntüle
docker-compose logs db
```

### Uygulama Başlatma Sorunu

```bash
# Uygulama loglarını görüntüle
docker-compose logs app

# Container'ı yeniden build et
docker-compose build --no-cache
```

### Port Çakışması

Eğer portlar kullanımdaysa, `docker-compose.yml` dosyasında port mapping'leri değiştirin:

```yaml
ports:
  - "8001:8000"  # Host port 8001, container port 8000
``` 