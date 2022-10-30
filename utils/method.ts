import { StatusCodes } from 'http-status-codes';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HandlerWithMethods = {
  [key in HTTPMethods]: NextApiHandler;
};

const withMethod =
  <T extends NextApiRequest, U extends NextApiResponse>(handlers: Partial<HandlerWithMethods>) =>
  async (req: T, res: U) => {
    for (const method in handlers) {
      if (method === req.method) {
        return handlers[method as keyof typeof handlers]!(req, res);
      }
    }
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      status: 'error',
      msg: 'Method not allowed.',
    });
  };

export default withMethod;
