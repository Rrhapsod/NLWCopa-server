import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/pools/:id/games",
    {
      onRequest: [authenticate],
    },
    async (request) => {
      const getPoolParams = z.object({
        id: z.string(),
      });

      const { id } = getPoolParams.parse(request.params);

      const matches = await prisma.match.findMany({
        orderBy: {
          date: "desc",
        },
        include: {
          Guess: {
            where: {
              participant: {
                userId: request.user.sub,
                poolId: id,
              },
            },
          },
        },
      });

      return {
        matches: matches.map((match) => {
          return {
            ...match,
            guess: match.Guess.length > 0 ? match.Guess[0] : null,
            Guess: undefined,
          };
        }),
      };
    }
  );
}
