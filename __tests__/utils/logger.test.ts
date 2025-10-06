import { LogLevel, Logger } from '../app/utils/logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('LogLevel', () => {
    it('should have correct log levels', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
    });
  });

  describe('Configuration', () => {
    it('should have default configuration', () => {
      expect(logger['config'].enabled).toBe(true);
      expect(logger['config'].logLevel).toBe(LogLevel.DEBUG);
      expect(logger['config'].includeTimestamp).toBe(true);
      expect(logger['config'].includeSource).toBe(true);
    });

    it('should allow custom configuration', () => {
      const customLogger = new Logger({
        enabled: false,
        logLevel: LogLevel.WARN,
        includeTimestamp: false,
        includeSource: false,
      });

      expect(customLogger['config'].enabled).toBe(false);
      expect(customLogger['config'].logLevel).toBe(LogLevel.WARN);
      expect(customLogger['config'].includeTimestamp).toBe(false);
      expect(customLogger['config'].includeSource).toBe(false);
    });
  });

  describe('Logging Methods', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] Test debug message')
      );
    });

    it('should log info messages', () => {
      logger.info('Test info message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Test info message')
      );
    });

    it('should log warn messages', () => {
      logger.warn('Test warn message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Test warn message')
      );
    });

    it('should log error messages', () => {
      const error = new Error('Test error');
      logger.error('Test error message', error);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Test error message')
      );
    });

    it('should include context in log messages', () => {
      logger.info('Test message', { userId: '123', action: 'login' });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('userId: 123')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('action: login')
      );
    });
  });

  describe('Log Level Filtering', () => {
    it('should respect log level filtering', () => {
      const warnLogger = new Logger({ logLevel: LogLevel.WARN });
      
      warnLogger.debug('Debug message');
      warnLogger.info('Info message');
      warnLogger.warn('Warn message');
      warnLogger.error('Error message');

      expect(consoleSpy).toHaveBeenCalledTimes(2); // Only warn and error
    });

    it('should not log when disabled', () => {
      const disabledLogger = new Logger({ enabled: false });
      
      disabledLogger.debug('Debug message');
      disabledLogger.info('Info message');
      disabledLogger.warn('Warn message');
      disabledLogger.error('Error message');

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should format timestamps correctly', () => {
      logger.info('Test message');
      const logCall = consoleSpy.mock.calls[0][0];
      
      // Should contain timestamp in ISO format
      expect(logCall).toMatch(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\]/);
    });

    it('should not include timestamp when disabled', () => {
      const noTimestampLogger = new Logger({ includeTimestamp: false });
      noTimestampLogger.info('Test message');
      
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).not.toMatch(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\]/);
    });
  });

  describe('Source Information', () => {
    it('should include source information when enabled', () => {
      logger.info('Test message');
      const logCall = consoleSpy.mock.calls[0][0];
      
      // Should contain source info (file:line format)
      expect(logCall).toMatch(/\[.*:\d+\]/);
    });

    it('should not include source information when disabled', () => {
      const noSourceLogger = new Logger({ includeSource: false });
      noSourceLogger.info('Test message');
      
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).not.toMatch(/\[.*:\d+\]/);
    });
  });
});
