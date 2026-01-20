# kadinka# 🚀 Backend API

Spring Boot benzeri mimari yapı ile oluşturulmuş Node.js/TypeScript backend projesi.

## 📚 Dokümantasyon

### 🏗️ Mimari Dokümantasyonu

**Detaylı mimari dokümantasyonu için:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)

Bu dokümantasyonda şunları bulacaksınız:
- ✅ Mimari yapı açıklaması
- ✅ Dependency Injection (DI) nasıl çalışır?
- ✅ Yeni feature ekleme adım adım rehberi
- ✅ Örnek: Payment feature ekleme
- ✅ Katmanlar ve sorumluluklar

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js (v18+)
- PostgreSQL
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Environment değişkenlerini ayarla
cp .env.example .env

# Server'ı başlat
npm run dev
```

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── config/              # Konfigürasyon ve DI
│   ├── controller/          # HTTP controllers
│   ├── service/             # Business logic
│   ├── repository/          # Database access
│   ├── routes/              # Route definitions
│   ├── dto/                 # Data Transfer Objects
│   ├── model/               # Domain models
│   └── middleware/          # Express middleware
└── ARCHITECTURE.md          # Detaylı mimari dokümantasyonu
```

## 🔧 Yeni Feature Ekleme

Yeni bir feature eklemek için [`ARCHITECTURE.md`](./ARCHITECTURE.md#yeni-feature-ekleme-rehberi) dosyasındaki adımları takip edin.

### Kısa Özet

1. **Repository** oluştur (`repository/[feature].repository.ts`)
2. **Service** oluştur (`service/[feature].service.ts`)
3. **Controller** oluştur (`controller/[feature].controller.ts`)
4. **Module** oluştur (`config/modules/[feature].module.ts`)
5. **Routes** oluştur (`routes/[feature].routes.ts`)
6. `app.context.ts`'e module'ü ekle
7. `server.ts`'e route'u ekle

## 🏗️ Mimari Prensipler

- ✅ **Controller → Service → Repository** katmanlı yapı
- ✅ **Dependency Injection** ile gevşek bağlı bileşenler
- ✅ **Type-safe** container kullanımı
- ✅ **Modüler yapı** - Her feature kendi module'üne sahip
- ✅ **Separation of Concerns** - Her katman kendi sorumluluğuna odaklanır

## 📝 API Endpoints

### Health Check
```
GET /health
```

### Users
```
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# Test UI'ı ile çalıştır
npm run test:ui

# Coverage raporu
npm run test:coverage
```

**Detaylı test dokümantasyonu:** [`TESTING.md`](./TESTING.md)

## 🔗 İlgili Dokümantasyon

- [Mimari Dokümantasyonu](./ARCHITECTURE.md) - Detaylı mimari açıklaması
- [Test Dokümantasyonu](./TESTING.md) - Test yazma rehberi
- [Dependency Injection Nasıl Çalışır?](./ARCHITECTURE.md#dependency-injection-di-nasıl-çalışır)
- [Yeni Feature Ekleme Rehberi](./ARCHITECTURE.md#yeni-feature-ekleme-rehberi)

---

**Sorularınız için:** [`ARCHITECTURE.md`](./ARCHITECTURE.md) dosyasını inceleyin.
