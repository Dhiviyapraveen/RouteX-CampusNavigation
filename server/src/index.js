import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectToMongo } from "./db/connect.js";

import { locationsRouter } from "./routes/locations.js";
import { routesRouter } from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "campus-navigator-server" });
});

app.use("/api/locations", locationsRouter);
app.use("/api/routes", routesRouter);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "InternalServerError" });
});

async function start() {
  await connectToMongo();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", err);
  process.exitCode = 1;
});

