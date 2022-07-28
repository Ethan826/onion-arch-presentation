import jwksClient, { CertSigningKey, SigningKey } from "jwks-rsa";
import {
  type GetPublicKeyOrSecret,
  type VerifyOptions,
  verify,
  Secret,
} from "jsonwebtoken";

// =============================================================================
// Core
// =============================================================================
interface User {
  givenName: string;
  middleName?: string;
  familyName: string;
}

// =============================================================================
// Auth
// =============================================================================

/***********
 * SERVICE *
 ***********/

export interface AuthorizationService<Credential> {
  /** Authenticate a user asynchronously based on the credential. */
  authenticate: (credential: Credential) => Promise<boolean>;
}

/******************
 * IMPLEMENTATION *
 ******************/

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client = jwksClient({ jwksUri: process.env.JWKS_URI! });

const isCertSigningKey = (key: SigningKey | undefined): key is CertSigningKey =>
  !!key && Object.hasOwnProperty.call(key, "publicKey");

const getKey: GetPublicKeyOrSecret = (header, callback): void => {
  client.getSigningKey(header.kid, (_, key) => {
    const signingKey = isCertSigningKey(key)
      ? key.publicKey
      : key?.rsaPublicKey;
    callback(null, signingKey);
  });
};

const promiseVerify = (
  token: string,
  getKey: GetPublicKeyOrSecret | Secret,
  options: VerifyOptions
): Promise<boolean> =>
  new Promise((resolve) =>
    verify(token, getKey, options, (err) =>
      err ? resolve(false) : resolve(true)
    )
  );

export const jwtAuthorizationService: AuthorizationService<string> = {
  authenticate: async (token: string) => promiseVerify(token, getKey, {}),
};

// =============================================================================
// Persistence
// =============================================================================

/***********
 * SERVICE *
 ***********/

export interface PersistenceService<Id> {
  /** Get a user by ID. */
  getUser: (id: Id) => Promise<User | null>;
  /** Update a user, returning a `true` on success. */
  insertUser: (user: User) => Promise<boolean>;
}

/******************
 * IMPLEMENTATION *
 ******************/

import { Client } from "pg";

const pgClient = new Client();

export const postgresPersistenceService: PersistenceService<number> = {
  getUser: async (id: number) => {
    pgClient.connect();

    const res = await pgClient.query("SELECT * FROM users WHERE id = $1", [id]);
    await pgClient.end();

    if (res.rowCount === 0) return null;
    if (res.rowCount > 1) throw new Error("Multiple users with the same ID");

    const { givenName, middleName, familyName } = res.rows[0];

    if (!givenName || !familyName) throw new Error("Invalid user");

    return { givenName, middleName, familyName };
  },

  insertUser: async (user: User) => {
    pgClient.connect();

    const { givenName, middleName, familyName } = user;

    try {
      await pgClient.query(
        "INSERT INTO users (given_name, middle_name, family_name) VALUES ($1, $2, $3) RETURNING id",
        [givenName, middleName, familyName]
      );

      await pgClient.end();
      return true;
    } catch (_) {
      return false;
    }
  },
};

// =============================================================================
// Logging
// =============================================================================

/***********
 * SERVICE *
 ***********/

export interface LoggingService {
  /** Log a message synchronously. */
  log: (message: string) => void;
}

/******************
 * IMPLEMENTATION *
 ******************/

import pinoCtor from "pino";

const pino = pinoCtor();

export const pinoLoggingService: LoggingService = {
  log: pino.debug,
};
