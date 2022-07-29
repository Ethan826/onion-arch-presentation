import { AuthorizationService } from "../services/authorization-service";
import jwksClient, { CertSigningKey, SigningKey } from "jwks-rsa";
import {
  type GetPublicKeyOrSecret,
  type VerifyOptions,
  verify,
  Secret,
} from "jsonwebtoken";

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

export const jwtAuthorizationProvider: AuthorizationService<string> = {
  authorize: async (token: string) => promiseVerify(token, getKey, {}),
};
