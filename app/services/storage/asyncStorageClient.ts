import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../../utils/logger';

export class AsyncStorageClient {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Error getting ${key} from AsyncStorage`, error as Error, { key });
      return null;
    }
  }

  static async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Error setting ${key} to AsyncStorage`, error as Error, { key });
      return false;
    }
  }

  static async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(`Error removing ${key} from AsyncStorage`, error as Error, { key });
      return false;
    }
  }

  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      logger.error('Error clearing AsyncStorage', error as Error);
      return false;
    }
  }
}
