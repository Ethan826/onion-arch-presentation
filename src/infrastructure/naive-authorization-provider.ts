import { AuthorizationService } from "../services/authorization-service";
import { decode } from "jsonwebtoken";

export const naiveJwtProvider: AuthorizationService<string> = {
  authorize: (token: string): Promise<boolean> => {
    try {
      const decoded = decode(token, { json: true });
      if (!decoded) {
        return Promise.resolve(false);
      }

      const { sub, aud } = decoded;

      return Promise.resolve(sub === "admin" && aud === "api");
    } catch (e) {
      return Promise.resolve(false);
    }
  },
};
