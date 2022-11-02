import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "João Novato",
      email: "joaonovato@thesims.com",
      avatarUrl:
        "https://otakuinc.com/images/video_games/the_sims/ft_Bob_Newbie.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Bolão do exemplo",
      code: "BOL123",
      userId: user.id,

      Participant: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.match.create({
    data: {
      date: "2022-11-02T12:00:00.561Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.match.create({
    data: {
      date: "2022-11-07T17:00:00.561Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "AR",

      Guess: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
