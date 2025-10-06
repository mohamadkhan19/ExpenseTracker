export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source?: string;
  context?: Record<string, any>;
  stack?: string;
}

export interface LoggerConfig {
  enabled: boolean;
  minLevel: LogLevel;
  includeTimestamp: boolean;
  includeSource: boolean;
  maxLogs: number;
  persistToStorage: boolean;
}

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
    this.config = {
      enabled: true,
      minLevel: this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
      includeTimestamp: true,
      includeSource: true,
      maxLogs: 1000,
      persistToStorage: this.isDevelopment,
    };
  }

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').replace('Z', '');
  }

  private getSourceInfo(): string {
    if (!this.config.includeSource) return '';
    
    // Get stack trace to find caller
    const stack = new Error().stack;
    if (!stack) return '';
    
    const lines = stack.split('\n');
    // Skip the first 3 lines (Error, getSourceInfo, log method)
    const callerLine = lines[3];
    if (!callerLine) return '';
    
    // Extract file name and line number, handling Metro bundler paths
    const match = callerLine.match(/\((.+):(\d+):\d+\)/);
    if (match) {
      const filePath = match[1];
      const lineNumber = match[2];
      
      // Clean up Metro bundler path parameters
      const cleanPath = filePath.split('&')[0]; // Remove everything after first &
      const fileName = cleanPath.split('/').pop()?.replace('.tsx', '').replace('.ts', '') || 'unknown';
      
      return `${fileName}:${lineNumber}`;
    }
    
    return '';
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = this.config.includeTimestamp ? `[${this.formatTimestamp()}]` : '';
    const source = this.getSourceInfo();
    const sourceStr = source ? `[${source}]` : '';
    const levelStr = LogLevel[level].padEnd(5);
    
    let formattedMessage = `${timestamp}${sourceStr} [${levelStr}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }
    
    return formattedMessage;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.minLevel;
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      source: this.getSourceInfo(),
      context,
      stack: error?.stack,
    };

    this.logs.push(logEntry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }

    // Output to console with appropriate method
    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.log(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        if (error) {
          console.error(error);
        }
        break;
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.addLog(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.addLog(LogLevel.ERROR, message, context, error);
  }

  // Configuration methods
  setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  // Log management methods
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  // Search and filter methods
  searchLogs(query: string): LogEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return this.logs.filter(log => 
      log.message.toLowerCase().includes(lowercaseQuery) ||
      log.source?.toLowerCase().includes(lowercaseQuery) ||
      JSON.stringify(log.context || {}).toLowerCase().includes(lowercaseQuery)
    );
  }

  filterLogs(level?: LogLevel, source?: string): LogEntry[] {
    return this.logs.filter(log => {
      if (level !== undefined && log.level !== level) return false;
      if (source && !log.source?.includes(source)) return false;
      return true;
    });
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export types and utilities
export { Logger };
export type { LogEntry, LoggerConfig };
