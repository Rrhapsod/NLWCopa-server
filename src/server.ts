import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import "dotenv/config.js";
import { secretKey } from "../config/configuration";

import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { matchRoutes } from "./routes/match";
import { guessRoutes } from "./routes/guess";
import { authRoutes } from "./routes/auth";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: secretKey,
  });

  await fastify.register(poolRoutes);
  await fastify.register(userRoutes);
  await fastify.register(matchRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(authRoutes);

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
