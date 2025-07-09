import random
import string
from sqlalchemy.orm import Session
from database import SessionLocal
from crud import create_user
from schemas import UserCreate

def generate_random_name():
    """Rastgele Türkçe isimler oluşturur"""
    first_names = [
        "Ahmet", "Mehmet", "Ali", "Ayşe", "Fatma", "Mustafa", "Hüseyin", "İbrahim",
        "Hasan", "Hüseyin", "Yusuf", "Murat", "Özlem", "Elif", "Zeynep", "Emine",
        "Hatice", "Meryem", "Sevgi", "Gül", "Can", "Deniz", "Ege", "Berk", "Kaan",
        "Arda", "Efe", "Burak", "Serkan", "Volkan", "Tolga", "Onur", "Uğur", "Serdar",
        "Ömer", "Yasin", "Emre", "Bilal", "İsmail", "Osman", "Halil", "Süleyman",
        "Ramazan", "Muharrem", "Recep", "Şaban", "Kadir", "Furkan", "Enes", "Talha",
        "Zübeyr", "Ömer", "Hamza", "Musa", "Harun", "Yakup", "İshak", "İsmail",
        "Nuh", "Lut", "Salih", "Hud", "Şuayb", "Lokman", "Danyal", "Yunus", "Eyyub",
        "Zülkifl", "İlyas", "Yahya", "İsa", "Muhammed", "Abdullah", "Abdurrahman",
        "Abdülkadir", "Abdülhamid", "Abdülmecid", "Abdülaziz", "Abdülkerim",
        "Abdülmuttalib", "Abdülkuddüs", "Abdülvahid", "Abdülvasi", "Abdülvehhab",
        "Abdülvekil", "Abdülvelli", "Abdülvettah", "Abdülvahhab", "Abdülvasi",
        "Abdülvekil", "Abdülvelli", "Abdülvettah", "Abdülvahhab", "Abdülvasi"
    ]
    
    last_names = [
        "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Özkan",
        "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Erdoğan",
        "Koç", "Kurt", "Özkan", "Şen", "Erkan", "Güneş", "Yavuz", "Polat", "Taş",
        "Korkmaz", "Özer", "Güler", "Şahin", "Bozkurt", "Çoban", "Korkmaz", "Özkan",
        "Güneş", "Yavuz", "Polat", "Taş", "Korkmaz", "Özer", "Güler", "Şahin",
        "Bozkurt", "Çoban", "Korkmaz", "Özkan", "Güneş", "Yavuz", "Polat", "Taş",
        "Korkmaz", "Özer", "Güler", "Şahin", "Bozkurt", "Çoban", "Korkmaz", "Özkan",
        "Güneş", "Yavuz", "Polat", "Taş", "Korkmaz", "Özer", "Güler", "Şahin",
        "Bozkurt", "Çoban", "Korkmaz", "Özkan", "Güneş", "Yavuz", "Polat", "Taş",
        "Korkmaz", "Özer", "Güler", "Şahin", "Bozkurt", "Çoban", "Korkmaz", "Özkan",
        "Güneş", "Yavuz", "Polat", "Taş", "Korkmaz", "Özer", "Güler", "Şahin",
        "Bozkurt", "Çoban", "Korkmaz", "Özkan", "Güneş", "Yavuz", "Polat", "Taş"
    ]
    
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_random_email(name):
    """İsimden rastgele email oluşturur"""
    email_domains = [
        "gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "live.com",
        "yandex.com", "protonmail.com", "icloud.com", "aol.com", "mail.com"
    ]
    
    # İsmi email formatına çevir
    name_parts = name.lower().split()
    if len(name_parts) >= 2:
        email_name = f"{name_parts[0]}.{name_parts[1]}"
    else:
        email_name = name_parts[0]
    
    # Rastgele sayı ekle
    random_number = random.randint(1, 999)
    domain = random.choice(email_domains)
    
    return f"{email_name}{random_number}@{domain}"

def add_test_users(count=100):
    """Belirtilen sayıda test kullanıcısı ekler"""
    db = SessionLocal()
    try:
        added_count = 0
        for i in range(count):
            try:
                # Rastgele isim oluştur
                name = generate_random_name()
                
                # Email oluştur
                email = generate_random_email(name)
                
                # Kullanıcı oluştur
                user_data = UserCreate(name=name, email=email)
                created_user = create_user(db=db, user=user_data)
                
                added_count += 1
                print(f"✅ Kullanıcı {added_count}/{count} eklendi: {created_user.name} ({created_user.email})")
                
            except Exception as e:
                print(f"❌ Kullanıcı {i+1} eklenirken hata: {e}")
                continue
        
        print(f"\n🎉 Toplam {added_count} kullanıcı başarıyla eklendi!")
        return added_count
        
    except Exception as e:
        print(f"❌ Genel hata: {e}")
        return 0
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Test kullanıcıları ekleniyor...")
    print("=" * 50)
    
    # Kullanıcı sayısını buradan değiştirebilirsiniz
    user_count = 100
    
    added_users = add_test_users(user_count)
    
    print("=" * 50)
    if added_users > 0:
        print(f"✅ İşlem tamamlandı! {added_users} kullanıcı eklendi.")
    else:
        print("❌ Hiç kullanıcı eklenemedi.") 