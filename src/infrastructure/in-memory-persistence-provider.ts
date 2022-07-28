import { User } from "../core/user";
import { PersistenceService } from "../services/persistence-service";
import { v4 } from "uuid";

const memoryDb = new Map<string, User>();

export const inMemoryPersistenceProvider: PersistenceService<string> = {
  getUser: (id: string): Promise<User | null> =>
    Promise.resolve(memoryDb.get(id) ?? null),

  insertUser: (user: User): Promise<string> => {
    const id = v4();
    memoryDb.set(id, user);
    return Promise.resolve(id);
  },
};
