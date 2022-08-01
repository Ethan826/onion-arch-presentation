import express from "express";
import { isUser } from "./core/user";
import { naiveJwtProvider } from "./infrastructure/naive-authorization-provider";
import { consoleLoggingProvider } from "./infrastructure/console-logging-provider";
import { inMemoryPersistenceProvider } from "./infrastructure/in-memory-persistence-provider";
import { Prod } from "./prod";

const app = express();
const port = 3000;
app.use(express.json());

// Compare to Nest and other IOC / DI frameworks.
const api = new Prod({
  loggingProvider: consoleLoggingProvider,
  persistenceProvider: inMemoryPersistenceProvider,
  authorizationProvider: naiveJwtProvider,
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  api.log(`GET USER call received for ${id}`);

  const [, token] = req.headers.authorization?.split("Bearer ") || [];
  if (!token) {
    api.log("No token provided");
    res.status(401).send("No token provided");
    return;
  }

  if (typeof id !== "string") {
    api.log("Invalid ID, sending 400");
    res.status(400).send("Invalid ID");
    return;
  }

  const user = await api.getUser(token, req.params.id);

  if (user) {
    api.log(`User found: ${JSON.stringify(user)}, sending 200`);
    res.send(user);
  } else {
    api.log("User not found, sending 404");
    res.status(404).send("User not found");
  }
});

app.get("/users", async (req, res) => {
  const [, token] = req.headers.authorization?.split("Bearer ") || [];
  if (!token) {
    api.log("No token provided");
    res.status(401).send("No token provided");
    return;
  }

  api.log("GET USERS call received");

  const users = await api.allUsers(token);

  api.log("Sending 200");
  res.send(users);
});

app.post("/user", async (req, res) => {
  const user = req.body;
  api.log(`POST call received for ${JSON.stringify(user)}`);

  const [, token] = req.headers.authorization?.split("Bearer ") || [];
  if (!token) {
    api.log("No token provided");
    res.status(401).send("No token provided");
    return;
  }

  if (isUser(user)) {
    const id = await api.insertUser(token, user);
    res.status(201).send({ id });
  }
});

app.listen(port, () => {
  api.log(`Listening on port ${port}`);
});
