import { PrismaClient } from '@prisma/client';
import { excludePasswordMiddleware } from '../middlewares/excludePassword';

// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient;

declare global {
  /**
   * @internal
   */
  // eslint-disable-next-line vars-on-top, no-var
  var __dev_prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const client = new PrismaClient();
  client.$use(excludePasswordMiddleware);
  return client;
};

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.__dev_prisma) {
    global.__dev_prisma = createPrismaClient();
  }
  prisma = global.__dev_prisma;
}

export default prisma;
