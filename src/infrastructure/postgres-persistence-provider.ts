import { Client } from "pg";
import { User } from "../core/user";
import { PersistenceService } from "../services/persistence-service";

const pgClient = new Client();

export const postgresPersistenceProvider: PersistenceService<number> = {
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
