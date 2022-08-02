import { User } from "./core/user";
import { ApiService } from "./services/api-service";
import { AuthorizationService } from "./services/authorization-service";
import { LoggingService } from "./services/logging-service";
import { PersistenceService } from "./services/persistence-service";

export class ProdApi implements ApiService<string, string> {
  public log;

  private authorize;
  private readUser;
  private readUsers;
  private writeUser;

  constructor({
    loggingProvider,
    persistenceProvider,
    authorizationProvider,
  }: {
    loggingProvider: LoggingService;
    persistenceProvider: PersistenceService<string>;
    authorizationProvider: AuthorizationService<string>;
  }) {
    this.log = loggingProvider.log;
    this.authorize = authorizationProvider.authorize;
    this.readUser = persistenceProvider.getUser;
    this.readUsers = persistenceProvider.getUsers;
    this.writeUser = persistenceProvider.insertUser;
  }

  public async getUser(credential: string, id: string): Promise<User | null> {
    this.log(`getUser call received for ${id}`);
    const isAuthorized = await this.authorize(credential);

    if (!isAuthorized) {
      this.log(`Caller with ${credential} not authorized`);
      throw new Error("Not authorized");
    } else {
      this.log(`Caller with ${credential} authorized`);
      const user = await this.readUser(id);
      user
        ? this.log(`User found: ${JSON.stringify(user)}`)
        : this.log("User not found");
      return user;
    }
  }

  public async allUsers(credential: string): Promise<User[]> {
    this.log("allUsers call received");
    const isAuthorized = await this.authorize(credential);

    if (!isAuthorized) {
      this.log(`Caller with ${credential} not authorized`);
      throw new Error("Not authorized");
    } else {
      this.log(`Caller with ${credential} authorized`);
      const users = await this.readUsers();
      this.log(`${users.length} users found`);
      return users;
    }
  }

  public async insertUser(credential: string, user: User): Promise<string> {
    this.log("insertUser call received");
    const isAuthorized = await this.authorize(credential);

    if (!isAuthorized) {
      this.log(`Caller with ${credential} not authorized`);
      throw new Error("Not authorized");
    } else {
      this.log(`Caller with ${credential} authorized`);
      const id = await this.writeUser(user);
      this.log(`User with id ${id} inserted`);
      return id;
    }
  }
}
