// src/exec/logger.ts - Enhanced logger with MCP support
interface McpServer {
  server: {
    sendLoggingMessage: (params: { 
      level: "debug" | "error" | "info" | "notice" | "warning" | "critical" | "alert" | "emergency";
      data?: unknown;
    }) => Promise<any>;
  };
}

interface Logger {
  info: (message: any, ...args: any[]) => void;
  error: (message: any, ...args: any[]) => void;
  warn: (message: any, ...args: any[]) => void;
  debug: (message: any, ...args: any[]) => void;
  setServer?: (server: McpServer) => void;
  clientLoggingEnabled?: () => boolean;
}

const createLogger = (): Logger => {
  let mcpServer: McpServer | null = null;
  
  // Check if we should suppress console output (test mode or CI)
  const shouldSuppressConsole = process.env.NODE_ENV === 'test' || 
                               process.env.CI === 'true' || 
                               process.env.ENACT_SKIP_INTERACTIVE === 'true';

  return {
    info: (message: any, ...args: any[]) => {
      if (!shouldSuppressConsole) {
        console.error('[INFO]', message, ...args);
      }
      if (mcpServer) {
        try {
          mcpServer.server.sendLoggingMessage({ level: "info", data: message });
        } catch (error) {
          // Fallback to console if MCP logging fails
        }
      }
    },
    error: (message: any, ...args: any[]) => {
      if (!shouldSuppressConsole) {
        console.error('[ERROR]', message, ...args);
      }
      if (mcpServer) {
        try {
          mcpServer.server.sendLoggingMessage({ level: "error", data: message });
        } catch (error) {
          // Fallback to console if MCP logging fails
        }
      }
    },
    warn: (message: any, ...args: any[]) => {
      if (!shouldSuppressConsole) {
        console.warn('[WARN]', message, ...args);
      }
      if (mcpServer) {
        try {
          mcpServer.server.sendLoggingMessage({ level: "warning", data: message });
        } catch (error) {
          // Fallback to console if MCP logging fails
        }
      }
    },
    debug: (message: any, ...args: any[]) => {
      if ((process.env.DEBUG || process.env.VERBOSE) && !shouldSuppressConsole) {
        console.error('[DEBUG]', message, ...args);
      }
      if (mcpServer) {
        try {
          mcpServer.server.sendLoggingMessage({ level: "debug", data: message });
        } catch (error) {
          // Fallback to console if MCP logging fails
        }
      }
    },
    setServer: (server: McpServer) => {
      mcpServer = server;
    },
    clientLoggingEnabled: () => {
      return !!mcpServer;
    }
  };
};

const logger = createLogger();

export { createLogger };
export default logger;
