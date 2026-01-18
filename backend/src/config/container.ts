/**
 * Type-safe Dependency Injection Container
 * Spring Boot Application Context benzeri
 */
class Container {
  private services = new Map<string | symbol, unknown>();

  /**
   * Register a service instance
   */
  register<T>(name: string | symbol, instance: T): void {
    this.services.set(name, instance);
  }

  /**
   * Get a service instance (type-safe)
   */
  get<T>(name: string | symbol): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${String(name)} not found in container`);
    }
    return service as T;
  }

  /**
   * Check if a service is registered
   */
  has(name: string | symbol): boolean {
    return this.services.has(name);
  }

  /**
   * Get all registered service names (for debugging)
   */
  getAllKeys(): (string | symbol)[] {
    return Array.from(this.services.keys());
  }
}

export const container = new Container();