/**
 * Represents the capability to log information about a running application
 * synchronously and infallibly.
 */
export interface LoggingService {
  /** Log a message synchronously. */
  log: (message: string) => void;
}
