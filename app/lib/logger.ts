// src/lib/logger.ts
type LogLevel = 'log' | 'info' | 'warn' | 'error' | string;
type Environment = 'development' | 'production' | 'staging';

interface LogConfig {
  level: LogLevel;
  message: string;
  data?: any;
  context?: Record<string, unknown>;
}

interface LoggerOptions {
  env?: Environment;
  defaultLevels?: LogLevel[];
  apiEndpoint?: string;
  appVersion?: string;
}

export class Logger {
  private readonly env: Environment;
  private readonly levels: Set<LogLevel>;
  private readonly apiEndpoint?: string;
  private readonly appVersion: string;
  private readonly customLevels: Record<string, LogLevel> = {};

  constructor(options: LoggerOptions = {}) {
    this.env = options.env || (process.env.NODE_ENV as Environment) || 'development';
    this.levels = new Set(options.defaultLevels || ['log', 'info', 'warn', 'error']);
    this.apiEndpoint = options.apiEndpoint;
    this.appVersion = options.appVersion || '1.0.0';
  }

  /**
   * Factory method to add new log levels
   */
  addLevel(level: LogLevel, styles: string[] = []): void {
    this.customLevels[level] = level;
    this.levels.add(level);

    // Add styled console method
    (this as any)[level] = (message: string, data?: any, context?: Record<string, unknown>) => {
      this.print({
        level,
        message,
        data,
        context
      });
    };
  }

  /**
   * Check if level should be logged based on environment
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.env === 'production') {
      return ['error', 'warn'].includes(level);
    }

    return this.levels.has(level);
  }

  /**
   * Get browser/OS info for error reporting
   */
  private getEnvironmentContext(): Record<string, unknown> {
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'server';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return {
      userAgent,
      url: currentUrl,
      timestamp: new Date().toISOString(),
      appVersion: this.appVersion,
      environment: this.env
    };
  }

  /**
   * Enhanced styling for console output
   */
  private getStyle(level: LogLevel): string[] {
    const styles: Record<LogLevel, string[]> = {
      log: [
        'color: #35495e',
        'background-color: #f8f9fa',
        'padding: 2px 4px',
        'border-radius: 4px',
        'border: 1px solid #dee2e6'
      ],
      info: [
        'color: #1a73e8',
        'background-color: #e8f0fe',
        'padding: 2px 4px',
        'border-radius: 4px',
        'border: 1px solid #d2e3fc'
      ],
      warn: [
        'color: #f57c00',
        'background-color: #fff3e0',
        'padding: 2px 4px',
        'border-radius: 4px',
        'border: 1px solid #ffe0b2'
      ],
      error: [
        'color: #d32f2f',
        'background-color: #fce4ec',
        'padding: 2px 4px',
        'border-radius: 4px',
        'border: 1px solid #f8bbd0',
        'font-weight: bold'
      ],
    };

    return styles[level] || styles.log;
  }

  /**
   * Send error to API for tracking
   */
  private async sendErrorToAPI(error: Error, context: Record<string, unknown>): Promise<void> {
    if (!this.apiEndpoint) return;

    try {
      const payload = {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        context: {
          ...context,
          ...this.getEnvironmentContext()
        }
      };

      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to send error to API:', err);
    }
  }

  /**
   * Core print method with formatting
   */
  private print(config: LogConfig): void {
    if (!this.shouldLog(config.level)) return;

    const style = this.getStyle(config.level).join(';');

    const timestamp = new Date().toISOString();

    const groupTitle = `%c[${timestamp}] ${config.level.toUpperCase()}`;

    // Add spacing before
    console.log('');

    // Group messages for better readability
    console.groupCollapsed(groupTitle, style);

    console.log(`%cMessage:`, 'font-weight: bold', config.message);

    if (config.data) {
      console.log('%cData:', 'font-weight: bold', config.data);
    }

    if (config.context) {
      console.log('%cContext:', 'font-weight: bold', config.context);
    }

    // Add error stack trace if available
    if (config.level === 'error' && config.data instanceof Error) {
      console.log('%cStack:', 'font-weight: bold', config.data.stack);

      // Send critical errors to API
      if (this.env === 'production') {
        this.sendErrorToAPI(config.data, {
          customContext: config.context,
          logMessage: config.message
        });
      }
    }

    console.groupEnd();

    // Add spacing after
    console.log('');
  }

  /**
   * Standard log methods
   */
  public log(message: string, data?: any, context?: Record<string, unknown>): void {
    this.print({ level: 'log', message, data, context });
  }

  public info(message: string, data?: any, context?: Record<string, unknown>): void {
    this.print({ level: 'info', message, data, context });
  }

  public warn(message: string, data?: any, context?: Record<string, unknown>): void {
    this.print({ level: 'warn', message, data, context });
  }

  public error(message: string, error: Error, context?: Record<string, unknown>): void {
    this.print({ level: 'error', message, data: error, context });
  }
}

// Singleton instance with default configuration
export const logger = new Logger({
  env: process.env.NODE_ENV as Environment || 'development',
  apiEndpoint: process.env.NEXT_PUBLIC_ERROR_API_URL,
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION
});

// Example custom level
logger.addLevel('success', [
  'color: #388e3c',
  'background-color: #e8f5e9',
  'padding: 2px 4px',
  'border-radius: 4px',
  'border: 1px solid #c8e6c9'
]);