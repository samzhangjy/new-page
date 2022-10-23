import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const getIP = (req: NextApiRequest) => req.socket.remoteAddress as string;

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 10,
});

const rateLimitGuard = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await rateLimiter.consume(getIP(req));
    return true;
  } catch {
    res
      .status(StatusCodes.TOO_MANY_REQUESTS)
      .json({ status: 'error', msg: 'Too many requests. Try again later.' });
    return false;
  }
};

export default rateLimitGuard;
