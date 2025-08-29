/* eslint-disable @typescript-eslint/no-unused-vars */
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const createNoopStorage = (): Storage => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage: Storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

export default storage;
