import { User } from "../core/user";

/** Provides methods for an external API such as a REST API. */
export interface ApiService<Credential, Id> {
  /** Get a user by ID. */
  getUser(credential: Credential, id: Id): Promise<User | null>;
  /** Update a user, returning the ID on success. */
  insertUser(credential: Credential, user: User): Promise<Id>;
  /** Get all users. */
  allUsers(credential: Credential): Promise<User[]>;
}
