import { User } from "../core/user";
import { AuthorizationService } from "../services/authorization-service";

export const backdoorAuthorizationProvider: AuthorizationService<User> = {
  authorize: ({ givenName, middleName, familyName }: User): Promise<boolean> =>
    Promise.resolve(
      givenName === "Ethan" && middleName === "Essex" && familyName === "Kent"
    ),
};
