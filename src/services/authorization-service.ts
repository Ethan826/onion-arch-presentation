/** Represents the ability to verify a credential asynchronously. */
export interface AuthorizationService<Credential> {
  /** Authenticate a user asynchronously based on the credential. */
  authenticate: (credential: Credential) => Promise<boolean>;
}
