import { User } from "../core/user";

export interface ApiService<Credential, Id> {
  getUser(credential: Credential, id: Id): Promise<User | null>;
  insertUser(credential: Credential, user: User): Promise<Id>;
  allUsers(credential: Credential): Promise<User[]>;
}
