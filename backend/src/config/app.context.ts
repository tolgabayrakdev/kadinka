/**
 * Application Context - Spring Boot Application Context benzeri
 * Tüm feature modüllerini burada initialize ediyoruz
 * 
 * Büyük projeler için: Her feature kendi module'üne sahip
 * 30 feature = 30 module.registerXXXModule() çağrısı
 */
import { registerUserModule } from './modules/user.module.js';
// import { registerPaymentModule } from './modules/payment.module.js';
// import { registerCustomerModule } from './modules/customer.module.js';
// ... diğer module'ler

export function initializeApplicationContext(): void {
    // Her feature için kendi module'ünü register et
    registerUserModule();
    // registerPaymentModule();
    // registerCustomerModule();
    // ... diğer module'ler

    console.log('✅ Application context initialized successfully');
    console.log(`📦 Registered modules: User`);
    // console.log(`📦 Registered modules: User, Payment, Customer, ...`);
}
