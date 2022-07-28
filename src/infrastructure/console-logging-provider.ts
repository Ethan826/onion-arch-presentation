import { LoggingService } from "../services/logging-service";

export const consoleLoggingProvider: LoggingService = {
  log: console.log,
};
