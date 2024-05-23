import type { Store } from 'tauri-plugin-store-api';

class LocalStore {
  store?: Store;

  async getStore() {
    if (__PLATFORM__ === __PLATFORM_TAURI__) {
      if (!this.store) {
        const { Store } = await import('tauri-plugin-store-api');

        this.store = new Store('data.dat');
      }

      return this.store;
    }

    return undefined;
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (__PLATFORM__ === __PLATFORM_TAURI__) {
      return (await this.getStore())!.set(key, value);
    }

    if (__PLATFORM__ === __PLATFORM_WEB__) {
      const { set } = await import('idb-keyval');

      return set(key, value);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (__PLATFORM__ === __PLATFORM_TAURI__) {
      return (await this.getStore())!.get<T>(key);
    }

    if (__PLATFORM__ === __PLATFORM_WEB__) {
      const { get } = await import('idb-keyval');

      return (await get(key)) ?? null;
    }

    return null;
  }

  async delete(key: string): Promise<boolean> {
    if (__PLATFORM__ === __PLATFORM_TAURI__) {
      return (await this.getStore())!.delete(key);
    }

    if (__PLATFORM__ === __PLATFORM_WEB__) {
      const { del } = await import('idb-keyval');

      await del(key);

      return true;
    }

    return false;
  }
}

export const store = new LocalStore();
