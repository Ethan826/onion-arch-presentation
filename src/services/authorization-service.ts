/** Represents the ability to verify a credential asynchronously. */
export interface AuthorizationService<Credential> {
  /** Authorize a user asynchronously based on the credential. */
  authorize: (credential: Credential) => Promise<boolean>;
}
