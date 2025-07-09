# Python 3.10 tam imajı kullan
FROM python:3.10

# Çalışma dizinini ayarla
WORKDIR /app

# Python bağımlılıklarını kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodlarını kopyala
COPY . .

# Port 8000'i expose et
EXPOSE 8000

# Uygulamayı başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 