import { User } from "../core/user";

/** Represents the ability to persist user data asynchronously. */
export interface PersistenceService<Id> {
  /** Get a user by ID. */
  getUser: (id: Id) => Promise<User | null>;
  /** Update a user, returning the ID on success. */
  insertUser: (user: User) => Promise<Id>;
}
