# 🚀 Backend API

Spring Boot benzeri mimari yapı ile oluşturulmuş **Node.js / TypeScript** backend projesi.

Bu proje;
- **Katmanlı mimari**
- **Dependency Injection (DI)**
- **Event-Driven Architecture**
yaklaşımıyla tasarlanmıştır.

---

## 📚 Dokümantasyon

### 🏗️ Mimari Dokümantasyonu

**Detaylı mimari dokümantasyonu için:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)

Bu dokümantasyonda şunları bulacaksınız:
- ✅ Mimari yapı açıklaması
- ✅ Dependency Injection (DI) nasıl çalışır?
- ✅ Event-Driven Architecture yaklaşımı
- ✅ Queue & Worker yapısı (BullMQ)
- ✅ Async işlemler (email, audit, notification)
- ✅ Yeni feature ekleme adım adım rehberi
- ✅ Örnek: Payment feature + event & queue entegrasyonu
- ✅ Katmanlar ve sorumluluklar

---

## ⚡ Event-Driven Architecture

Bu proje, **HTTP request’leri** ile **arka plan işlemlerini (side-effects)** birbirinden ayırmak için  
**Event-Driven Architecture** kullanır.

### 🎯 Event ne zaman kullanılır?
- 📧 Email gönderimi
- 🧾 Audit / activity log
- 🔔 Notification
- 📊 Analytics
- 💳 Payment sonrası işlemler

### 🔄 Akış

```
HTTP Request
   ↓
Controller
   ↓
Service
   ↓
Domain Event (ör: user.created)
   ↓
Queue (BullMQ)
   ↓
Worker
   ↓
Side Effects (mail, audit, notification)
```

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js (v18+)
- PostgreSQL
- Redis
- npm veya yarn

### Kurulum

```bash
npm install
cp .env.example .env
npm run dev
npm run worker:user
```

---

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── config/              # Konfigürasyon, DI ve queue ayarları
│   ├── controller/          # HTTP controllers
│   ├── service/             # Business logic
│   ├── repository/          # Database access
│   ├── routes/              # Route definitions
│   ├── dto/                 # Data Transfer Objects
│   ├── model/               # Domain models
│   ├── queue/               # Queue definitions (BullMQ)
│   ├── worker/              # Background workers
│   └── middleware/          # Express middleware
└── ARCHITECTURE.md
```

---

## 🏗️ Mimari Prensipler

- Controller → Service → Repository
- Event-Driven Architecture
- Dependency Injection
- Modüler yapı
- Separation of Concerns