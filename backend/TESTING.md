# 🧪 Test Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Test Yapısı](#test-yapısı)
3. [Test Çalıştırma](#test-çalıştırma)
4. [Test Yazma Rehberi](#test-yazma-rehberi)
5. [Unit Test Örnekleri](#unit-test-örnekleri)
6. [Best Practices](#best-practices)

---

## 🎯 Genel Bakış

Proje **Vitest** framework'ü ile test edilmektedir. **Unit testler** ve **integration testler** yazılmaktadır.

### Test Stack

- ✅ **Vitest** - Modern, hızlı test framework
- ✅ **TypeScript** - Type-safe testler
- ✅ **Mock'lar** - Bağımlılıkları mock'lama
- ✅ **Coverage** - Kod coverage raporları

---

## 📁 Test Yapısı

```
src/
├── __tests__/
│   ├── setup.ts              # Global test setup
│   ├── mocks/                # Mock classes ve data
│   │   └── user.repository.mock.ts
│   ├── unit/                 # Unit testler
│   │   ├── service/
│   │   │   └── user.service.test.ts
│   │   └── controller/
│   │       └── user.controller.test.ts
│   └── integration/          # Integration testler (gelecekte)
│       └── api/
│           └── user.api.test.ts
└── ...
```

---

## 🚀 Test Çalıştırma

### Tüm Testleri Çalıştır

```bash
npm test
```

### Test UI'ı ile Çalıştır

```bash
npm run test:ui
```

### Coverage Raporu

```bash
npm run test:coverage
```

### CI/CD için (watch mode olmadan)

```bash
npm run test:run
```

---

## ✍️ Test Yazma Rehberi

### 1. Unit Test Nedir?

**Unit test**, bir fonksiyon veya class'ın **yalnız başına** test edilmesidir. Bağımlılıklar (dependencies) **mock'lanır**.

**Örnek:**
- `UserService` test edilirken → `UserRepository` mock'lanır
- `UserController` test edilirken → `UserService` mock'lanır

### 2. Test Dosyası Oluşturma

Test dosyaları şu formatı takip eder:
- `[name].test.ts` - Unit testler
- `[name].spec.ts` - Alternatif format

**Konum:**
```
src/__tests__/unit/[katman]/[feature].[katman].test.ts
```

**Örnek:**
```
src/__tests__/unit/service/user.service.test.ts
src/__tests__/unit/controller/user.controller.test.ts
```

### 3. Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ClassName', () => {
    let instance: ClassName;
    let mockDependency: MockDependency;

    beforeEach(() => {
        // Her test öncesi setup
        mockDependency = createMockDependency();
        instance = new ClassName(mockDependency);
    });

    describe('methodName', () => {
        it('should do something when condition is met', async () => {
            // Arrange (Hazırlık)
            const input = { /* ... */ };
            const expectedOutput = { /* ... */ };
            mockDependency.method.mockResolvedValue(expectedOutput);

            // Act (Eylem)
            const result = await instance.methodName(input);

            // Assert (Doğrulama)
            expect(result).toEqual(expectedOutput);
            expect(mockDependency.method).toHaveBeenCalledWith(input);
        });

        it('should throw error when condition is not met', async () => {
            // Arrange
            const invalidInput = { /* ... */ };
            mockDependency.method.mockRejectedValue(new Error('...'));

            // Act & Assert
            await expect(instance.methodName(invalidInput)).rejects.toThrow(Error);
        });
    });
});
```

---

## 📝 Unit Test Örnekleri

### Service Test Örneği

```typescript
// src/__tests__/unit/service/user.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from '../../../service/user.service.js';
import { MockUserRepository } from '../../mocks/user.repository.mock.js';

describe('UserService', () => {
    let userService: UserService;
    let mockRepository: MockUserRepository;

    beforeEach(() => {
        mockRepository = new MockUserRepository();
        userService = new UserService(mockRepository as unknown as UserRepository);
    });

    describe('getUserById', () => {
        it('should return user when user exists', async () => {
            const user = await userService.getUserById(1);
            
            expect(user).toBeDefined();
            expect(user.id).toBe(1);
        });

        it('should throw NotFoundException when user does not exist', async () => {
            await expect(userService.getUserById(999))
                .rejects.toThrow(NotFoundException);
        });
    });
});
```

### Controller Test Örneği

```typescript
// src/__tests__/unit/controller/user.controller.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserController } from '../../../controller/user.controller.js';
import type { Request, Response, NextFunction } from 'express';

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: {
        getUserById: ReturnType<typeof vi.fn>;
    };
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockUserService = {
            getUserById: vi.fn(),
        };
        userController = new UserController(mockUserService as unknown as UserService);
        mockRequest = { params: {} };
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        mockNext = vi.fn();
    });

    describe('getUserById', () => {
        it('should return user by id successfully', async () => {
            mockRequest.params = { id: '1' };
            mockUserService.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(
                mockRequest as Request,
                mockResponse as Response,
                mockNext
            );

            expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });
});
```

---

## 🎓 Best Practices

### 1. AAA Pattern (Arrange-Act-Assert)

```typescript
it('should do something', async () => {
    // Arrange - Hazırlık
    const input = { email: 'test@example.com' };
    mockRepository.findByEmail.mockResolvedValue(null);

    // Act - Eylem
    const result = await service.createUser(input);

    // Assert - Doğrulama
    expect(result).toBeDefined();
    expect(result.email).toBe(input.email);
});
```

### 2. Her Test İzole Olmalı

```typescript
beforeEach(() => {
    // Her test öncesi temiz başlangıç
    mockRepository = new MockUserRepository();
    service = new UserService(mockRepository);
});
```

### 3. Açıklayıcı Test İsimleri

✅ **İyi:**
```typescript
it('should return user when user exists', ...);
it('should throw NotFoundException when user does not exist', ...);
it('should return 400 when id is invalid', ...);
```

❌ **Kötü:**
```typescript
it('test getUserById', ...);
it('test error', ...);
```

### 4. Mock'ları Kullan

✅ **İyi:**
```typescript
mockRepository.findById.mockResolvedValue(mockUser);
```

❌ **Kötü:**
```typescript
// Gerçek database'e bağlanma - unit test değil!
const repository = new UserRepository();
```

### 5. Edge Case'leri Test Et

```typescript
// Normal case
it('should return user when user exists', ...);

// Edge cases
it('should handle null values', ...);
it('should handle empty arrays', ...);
it('should handle invalid input', ...);
it('should handle concurrent requests', ...);
```

### 6. Error Handling Test Et

```typescript
it('should throw NotFoundException when user does not exist', async () => {
    await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
});
```

---

## 📊 Test Coverage

### Coverage Raporu Görüntüleme

```bash
npm run test:coverage
```

Bu komut şu sonuçları gösterir:
- **Statements** - Kaç satır kod test edildi
- **Branches** - Kaç if/else koşulu test edildi
- **Functions** - Kaç fonksiyon test edildi
- **Lines** - Kaç satır test edildi

### Hedef Coverage

- ✅ **Service katmanı**: %80+
- ✅ **Controller katmanı**: %70+
- ✅ **Repository katmanı**: %60+ (database bağımlılığı nedeniyle)

---

## 🐛 Test Debugging

### Debug Mode

```bash
# Vitest debug mode
npm test -- --inspect-brk
```

### Console Log Kullanımı

```typescript
it('should do something', async () => {
    console.log('Test başladı');
    const result = await service.method();
    console.log('Sonuç:', result);
    expect(result).toBeDefined();
});
```

---

## ✅ Test Checklist

Yeni bir feature için test yazarken:

- [ ] Service unit testleri yazıldı
- [ ] Controller unit testleri yazıldı
- [ ] Mock'lar oluşturuldu (`__tests__/mocks/`)
- [ ] Happy path test edildi
- [ ] Error cases test edildi
- [ ] Edge cases test edildi
- [ ] Testler çalışıyor (`npm test`)
- [ ] Coverage hedefleri karşılanıyor

---

## 📚 Kaynaklar

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://vitest.dev/guide/best-practices.html)
- [Mock Functions](https://vitest.dev/api/vi.html)

---

**Sorularınız için:** Test dokümantasyonunu güncelleyin veya proje maintainer'ına ulaşın.
