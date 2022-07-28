export interface User {
  givenName: string;
  middleName?: string;
  familyName: string;
}

export const isUser = (user: unknown): user is User => {
  return (
    user != null &&
    typeof user === "object" &&
    "givenName" in user &&
    "familyName" in user &&
    ((user as User).middleName === undefined ||
      typeof (user as User).middleName === "string")
  );
};
