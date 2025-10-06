import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageClient } from '../../app/services/storage/asyncStorageClient';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AsyncStorageClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed data when item exists', async () => {
      const testData = { name: 'John', age: 30 };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testData));

      const result = await AsyncStorageClient.get('test-key');

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null when item does not exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await AsyncStorageClient.get('non-existent-key');

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return null when item is empty string', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('');

      const result = await AsyncStorageClient.get('empty-key');

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json');

      const result = await AsyncStorageClient.get('invalid-key');

      expect(result).toBeNull();
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await AsyncStorageClient.get('error-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should store data successfully', async () => {
      const testData = { name: 'Jane', age: 25 };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await AsyncStorageClient.set('test-key', testData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
      expect(result).toBe(true);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const testData = { name: 'Bob', age: 35 };
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      const result = await AsyncStorageClient.set('error-key', testData);

      expect(result).toBe(false);
    });

    it('should handle complex data types', async () => {
      const complexData = {
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
        null: null,
      };
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const result = await AsyncStorageClient.set('complex-key', complexData);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('complex-key', JSON.stringify(complexData));
      expect(result).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove item successfully', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue(undefined);

      const result = await AsyncStorageClient.remove('test-key');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      const result = await AsyncStorageClient.remove('error-key');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all data successfully', async () => {
      mockAsyncStorage.clear.mockResolvedValue(undefined);

      const result = await AsyncStorageClient.clear();

      expect(mockAsyncStorage.clear).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      mockAsyncStorage.clear.mockRejectedValue(new Error('Storage error'));

      const result = await AsyncStorageClient.clear();

      expect(result).toBe(false);
    });
  });
});
