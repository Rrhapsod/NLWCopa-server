import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  fastify.post(
    "/pools/:poolId/matches/:matchId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        poolId: z.string(),
        matchId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { poolId, matchId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "Você não está autorizado a criar um palpite neste bolão.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_matchId: {
            participantId: participant.id,
            matchId,
          },
        },
      });

      if (guess) {
        return reply.status(400).send({
          message: "Você já fez um palpite nesta partida neste bolão.",
        });
      }

      const match = await prisma.match.findUnique({
        where: {
          id: matchId,
        },
      });

      if (!match) {
        return reply.status(400).send({
          message: "Partida não encontrada",
        });
      }

      if (match.date < new Date()) {
        return reply.status(400).send({
          message: "Este jogo já aconteceu.",
        });
      }

      await prisma.guess.create({
        data: {
          matchId,
          participantId: participant.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });

      return reply.status(201).send();
    }
  );
}
