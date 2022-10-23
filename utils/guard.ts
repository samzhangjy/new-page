import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export type Guard = (req: NextApiRequest, res: NextApiResponse) => Promise<boolean> | boolean;

const withGuard =
  <T extends NextApiRequest, U extends NextApiResponse>(handler: NextApiHandler, guards: Guard[]) =>
  async (req: T, res: U) => {
    for (const guard of guards) {
      // eslint-disable-next-line no-await-in-loop
      const shouldContinue = await guard(req, res);
      if (!shouldContinue) {
        res.end();
        return;
      }
    }
    await handler(req, res);
  };

export default withGuard;
