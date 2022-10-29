import { Prisma } from '@prisma/client';

export const excludePasswordMiddleware: Prisma.Middleware<any> = async (params, next) => {
  const result = await next(params);
  if (result && params?.model === 'User' && params?.args?.select?.password !== true) {
    delete result.password;
  }
  return result;
};
