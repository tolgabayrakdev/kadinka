# 🏗️ Backend Mimari Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mimari Yapı](#mimari-yapı)
3. [Dependency Injection (DI) Nasıl Çalışır?](#dependency-injection-di-nasıl-çalışır)
4. [Yeni Feature Ekleme Rehberi](#yeni-feature-ekleme-rehberi)
5. [Örnek: Payment Feature Ekleme](#örnek-payment-feature-ekleme)
6. [Katmanlar ve Sorumluluklar](#katmanlar-ve-sorumluluklar)

---

## 🎯 Genel Bakış

Bu proje **Spring Boot benzeri** bir mimari yapı kullanmaktadır. Katmanlı mimari (Layered Architecture) ve Dependency Injection (DI) pattern'leri ile **büyük projeler için ölçeklenebilir** bir yapı sağlar.

### Temel Prensipler

- ✅ **Controller → Service → Repository** katmanlı yapı
- ✅ **Dependency Injection** ile gevşek bağlı bileşenler
- ✅ **Type-safe** container kullanımı
- ✅ **Modüler yapı** - Her feature kendi module'üne sahip
- ✅ **Separation of Concerns** - Her katman kendi sorumluluğuna odaklanır

---

## 📁 Mimari Yapı

```
src/
├── config/                    # Konfigürasyon dosyaları
│   ├── container.ts          # Type-safe DI Container
│   ├── app.context.ts        # Ana application context (tüm module'leri başlatır)
│   ├── database.ts           # Database bağlantısı
│   ├── app.config.ts         # Uygulama ayarları
│   └── modules/              # Feature module'leri
│       ├── user.module.ts    # User feature DI
│       └── [feature].module.ts  # Diğer feature'lar
│
├── controller/               # HTTP isteklerini yönetir
│   └── user.controller.ts
│
├── service/                  # İş mantığı (business logic)
│   └── user.service.ts
│
├── repository/               # Veritabanı işlemleri
│   └── user.repository.ts
│
├── routes/                   # Route tanımları
│   └── user.routes.ts
│
├── dto/                      # Data Transfer Objects (validation)
│   └── user.dto.ts
│
├── model/                    # Domain modelleri
│   └── user.model.ts
│
├── middleware/               # Express middleware'leri
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── exception/                # Özel exception'lar
│   └── http.exception.ts
│
└── server.ts                 # Uygulama giriş noktası
```

---

## 🔧 Dependency Injection (DI) Nasıl Çalışır?

### 1. Container (DI Container)

`config/container.ts` dosyası **merkezi DI container**'dır. Spring Boot'taki Application Context benzeri.

```typescript
// Type-safe container
const container = new Container();

// Service kaydetme
container.register('UserService', userService);

// Service alma (type-safe)
const userService = container.get<UserService>('UserService');
```

**Özellikler:**
- ✅ Type-safe: Generic `get<T>()` metodu
- ✅ Runtime'da servis kontrolü
- ✅ Hata ayıklama için `getAllKeys()` metodu

### 2. Application Context

`config/app.context.ts` dosyası **tüm feature module'lerini başlatır**.

```typescript
export function initializeApplicationContext(): void {
    registerUserModule();
    registerPaymentModule();
    registerCustomerModule();
    // ... diğer module'ler
}
```

**Çalışma Mantığı:**
1. Server başlatıldığında `initializeApplicationContext()` çağrılır
2. Her feature'ın kendi `registerXXXModule()` fonksiyonu çalıştırılır
3. Her module kendi bağımlılıklarını (Repository → Service → Controller) kaydeder
4. Tüm bağımlılıklar container'a kaydedilir

### 3. Feature Module (Örnek: User Module)

`config/modules/user.module.ts` dosyası **User feature'ının tüm bağımlılıklarını** yönetir.

```typescript
export function registerUserModule(): void {
    // 1. Repository (bağımlılık yok)
    const userRepository = new UserRepository();
    container.register('UserRepository', userRepository);

    // 2. Service (repository'ye bağımlı)
    const userService = new UserService(userRepository);
    container.register('UserService', userService);

    // 3. Controller (service'e bağımlı)
    const userController = new UserController(userService);
    container.register('UserController', userController);
    container.register('userController', userController); // routes için
}
```

**Dependency Flow:**
```
UserRepository (bağımsız)
    ↓
UserService (UserRepository'ye bağımlı)
    ↓
UserController (UserService'e bağımlı)
```

### 4. Başlatma Sırası (Startup Flow)

```
1. server.ts
   └── initializeApplicationContext()
       
2. app.context.ts
   └── registerUserModule()
       └── registerPaymentModule()
           └── ... (diğer module'ler)
       
3. user.module.ts
   ├── UserRepository oluştur → container'a kaydet
   ├── UserService oluştur (UserRepository ile) → container'a kaydet
   └── UserController oluştur (UserService ile) → container'a kaydet

4. routes/user.routes.ts
   └── container.get<UserController>('userController')
```

---

## 🚀 Yeni Feature Ekleme Rehberi

30+ feature'ı kolayca eklemek için **modüler yapı** kullanıyoruz. Her feature için aynı adımları takip edin.

### Adım 1: Feature Dosyalarını Oluştur

#### 1.1 Repository
```typescript
// repository/payment.repository.ts
export class PaymentRepository {
    async findAll(): Promise<Payment[]> { ... }
    async findById(id: number): Promise<Payment | null> { ... }
    // ... diğer metodlar
}
```

#### 1.2 Service
```typescript
// service/payment.service.ts
export class PaymentService {
    constructor(private paymentRepository: PaymentRepository) { }
    
    async getAllPayments(): Promise<Payment[]> {
        return await this.paymentRepository.findAll();
    }
    // ... diğer metodlar
}
```

#### 1.3 Controller
```typescript
// controller/payment.controller.ts
export class PaymentController {
    constructor(private paymentService: PaymentService) { }
    
    getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
        // ...
    }
    // ... diğer metodlar
}
```

#### 1.4 Model & DTO
```typescript
// model/payment.model.ts
export interface Payment { ... }
export interface PaymentCreateData { ... }

// dto/payment.dto.ts
export const createPaymentSchema = z.object({ ... });
```

#### 1.5 Routes
```typescript
// routes/payment.routes.ts
import { container } from '../config/container.js';
import { PaymentController } from '../controller/payment.controller.js';

const router = Router();
const paymentController = container.get<PaymentController>('paymentController');

router.get('/', paymentController.getAllPayments);
// ... diğer route'lar

export default router;
```

### Adım 2: Feature Module Oluştur

```typescript
// config/modules/payment.module.ts
import { container } from '../container.js';
import { PaymentRepository } from '../../repository/payment.repository.js';
import { PaymentService } from '../../service/payment.service.js';
import { PaymentController } from '../../controller/payment.controller.js';

export function registerPaymentModule(): void {
    // 1. Repository
    const paymentRepository = new PaymentRepository();
    container.register('PaymentRepository', paymentRepository);

    // 2. Service
    const paymentService = new PaymentService(paymentRepository);
    container.register('PaymentService', paymentService);

    // 3. Controller
    const paymentController = new PaymentController(paymentService);
    container.register('PaymentController', paymentController);
    container.register('paymentController', paymentController); // lowercase for routes
}
```

### Adım 3: Application Context'e Ekle

```typescript
// config/app.context.ts
import { registerPaymentModule } from './modules/payment.module.js';

export function initializeApplicationContext(): void {
    registerUserModule();
    registerPaymentModule(); // ← YENİ EKLENEN
    // ... diğer module'ler
}
```

### Adım 4: Routes'u Server'a Ekle

```typescript
// server.ts
import paymentRoutes from './routes/payment.routes.js';

app.use(`${appConfig.apiPrefix}/payments`, paymentRoutes);
```

### Adım 5: Test Et

```bash
# Server'ı başlat
npm run dev

# Test endpoint'i
curl http://localhost:1234/api/v1/payments
```

---

## 📝 Örnek: Payment Feature Ekleme

### Senaryo
Payment (ödeme) özelliği ekleyeceğiz. Kullanıcılar ödeme yapabilir, ödeme geçmişini görebilir.

### Adım 1: Dosya Yapısı

```
src/
├── repository/
│   └── payment.repository.ts      ← YENİ
├── service/
│   └── payment.service.ts          ← YENİ
├── controller/
│   └── payment.controller.ts       ← YENİ
├── routes/
│   └── payment.routes.ts           ← YENİ
├── model/
│   └── payment.model.ts            ← YENİ
├── dto/
│   └── payment.dto.ts              ← YENİ
└── config/
    └── modules/
        └── payment.module.ts       ← YENİ
```

### Adım 2: Kod Örnekleri

#### Payment Repository
```typescript
// repository/payment.repository.ts
import { query } from '../config/database.js';
import type { Payment, PaymentCreateData } from '../model/payment.model.js';

export class PaymentRepository {
    async findAll(): Promise<Payment[]> {
        const sql = 'SELECT * FROM payments ORDER BY created_at DESC';
        const result = await query(sql);
        return result.rows;
    }

    async findById(id: number): Promise<Payment | null> {
        const sql = 'SELECT * FROM payments WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0] || null;
    }

    async create(paymentData: PaymentCreateData): Promise<Payment> {
        const sql = `
            INSERT INTO payments (amount, user_id, created_at)
            VALUES ($1, $2, NOW())
            RETURNING *
        `;
        const result = await query(sql, [paymentData.amount, paymentData.userId]);
        return result.rows[0];
    }
}
```

#### Payment Service
```typescript
// service/payment.service.ts
import { PaymentRepository } from '../repository/payment.repository.js';
import type { Payment, PaymentCreateData } from '../model/payment.model.js';
import { NotFoundException } from '../exception/http.exception.js';

export class PaymentService {
    constructor(private paymentRepository: PaymentRepository) { }

    async getAllPayments(): Promise<Payment[]> {
        return await this.paymentRepository.findAll();
    }

    async getPaymentById(id: number): Promise<Payment> {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }
        return payment;
    }

    async createPayment(paymentData: PaymentCreateData): Promise<Payment> {
        return await this.paymentRepository.create(paymentData);
    }
}
```

#### Payment Controller
```typescript
// controller/payment.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../service/payment.service.js';

export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            next(error);
        }
    };

    createPayment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payment = await this.paymentService.createPayment(req.body);
            res.status(201).json({ success: true, data: payment });
        } catch (error) {
            next(error);
        }
    };
}
```

#### Payment Module
```typescript
// config/modules/payment.module.ts
import { container } from '../container.js';
import { PaymentRepository } from '../../repository/payment.repository.js';
import { PaymentService } from '../../service/payment.service.js';
import { PaymentController } from '../../controller/payment.controller.js';

export function registerPaymentModule(): void {
    // 1. Repository
    const paymentRepository = new PaymentRepository();
    container.register('PaymentRepository', paymentRepository);

    // 2. Service
    const paymentService = new PaymentService(paymentRepository);
    container.register('PaymentService', paymentService);

    // 3. Controller
    const paymentController = new PaymentController(paymentService);
    container.register('PaymentController', paymentController);
    container.register('paymentController', paymentController);
}
```

### Adım 3: Application Context'e Ekle

```typescript
// config/app.context.ts
import { registerPaymentModule } from './modules/payment.module.js';

export function initializeApplicationContext(): void {
    registerUserModule();
    registerPaymentModule(); // ← YENİ

    console.log('✅ Application context initialized successfully');
    console.log('📦 Registered modules: User, Payment');
}
```

### Adım 4: Routes ve Server'a Ekle

```typescript
// routes/payment.routes.ts
import { Router } from 'express';
import { container } from '../config/container.js';
import { PaymentController } from '../controller/payment.controller.js';

const router = Router();
const paymentController = container.get<PaymentController>('paymentController');

router.get('/', paymentController.getAllPayments);
router.post('/', paymentController.createPayment);

export default router;
```

```typescript
// server.ts
import paymentRoutes from './routes/payment.routes.js';

app.use(`${appConfig.apiPrefix}/payments`, paymentRoutes);
```

---

## 📊 Katmanlar ve Sorumluluklar

### 🎮 Controller Katmanı
**Sorumluluk:** HTTP isteklerini almak, validasyon yapmak, Service'i çağırmak, response döndürmek

**YAPMALI:**
- ✅ HTTP istek/cevap işlemleri
- ✅ Request validation
- ✅ Service metodlarını çağırma
- ✅ Error handling (try-catch ile next(error))

**YAPMAMALI:**
- ❌ İş mantığı (business logic)
- ❌ Veritabanı işlemleri
- ❌ Direkt repository çağrıları

### 💼 Service Katmanı
**Sorumluluk:** İş mantığı, business rules, Repository'leri koordine etmek

**YAPMALI:**
- ✅ İş mantığı (business logic)
- ✅ Validasyon kuralları
- ✅ Repository metodlarını çağırma
- ✅ Exception fırlatma (NotFoundException, ConflictException)

**YAPMAMALI:**
- ❌ HTTP işlemleri
- ❌ Direkt SQL sorguları
- ❌ Request/Response objeleri ile çalışma

### 💾 Repository Katmanı
**Sorumluluk:** Veritabanı işlemleri, SQL sorguları

**YAPMALI:**
- ✅ Veritabanı CRUD işlemleri
- ✅ SQL sorguları
- ✅ Veri dönüşümü (row → model)

**YAPMAMALI:**
- ❌ İş mantığı
- ❌ Validasyon
- ❌ HTTP işlemleri

---

## ✅ Özet Checklist

Yeni bir feature eklerken:

- [ ] Repository dosyasını oluştur (`repository/[feature].repository.ts`)
- [ ] Service dosyasını oluştur (`service/[feature].service.ts`)
- [ ] Controller dosyasını oluştur (`controller/[feature].controller.ts`)
- [ ] Model & DTO dosyalarını oluştur (`model/`, `dto/`)
- [ ] Routes dosyasını oluştur (`routes/[feature].routes.ts`)
- [ ] Module dosyasını oluştur (`config/modules/[feature].module.ts`)
- [ ] `app.context.ts`'e `register[Feature]Module()` ekle
- [ ] `server.ts`'e route'u ekle
- [ ] Test et! 🎉

---

## 🎓 İpuçları

1. **Dependency Sırası:** Her zaman Repository → Service → Controller sırasıyla oluştur
2. **Type Safety:** Container'dan service alırken `get<T>()` generic kullan
3. **Modülerlik:** Her feature'ın kendi module'ü olsun, büyük projeler için kritik
4. **Naming:** Controller'ı hem `UserController` hem de `userController` (lowercase) olarak kaydet (routes için)

---

**Sorularınız için:** Proje maintainer'ına ulaşın veya bu dokümantasyonu güncelleyin.
