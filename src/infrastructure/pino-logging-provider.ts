import pinoCtor from "pino";
import { LoggingService } from "../services/logging-service";

const pino = pinoCtor();

export const pinoLoggingProvider: LoggingService = {
  log: pino.debug,
};
