/**
 * Dependency Injection Type Definitions
 * Type-safe container için token'lar
 */
export const TYPES = {
    // Repositories
    UserRepository: Symbol.for('UserRepository'),
    // PaymentRepository: Symbol.for('PaymentRepository'),
    // CustomerRepository: Symbol.for('CustomerRepository'),

    // Services
    UserService: Symbol.for('UserService'),
    // PaymentService: Symbol.for('PaymentService'),
    // CustomerService: Symbol.for('CustomerService'),

    // Controllers
    UserController: Symbol.for('UserController'),
    // PaymentController: Symbol.for('PaymentController'),
    // CustomerController: Symbol.for('CustomerController'),
} as const;
