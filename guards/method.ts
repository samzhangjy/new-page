import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';

const methodGuard = (methods: string | string[]) => {
  let realMethods = methods;
  if (!Array.isArray(methods)) {
    realMethods = [methods];
  }

  return (req: NextApiRequest, res: NextApiResponse) => {
    if (!realMethods.includes(req.method || 'GET')) {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        status: 'error',
        msg: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
      });
      return false;
    }
    return true;
  };
};

export default methodGuard;
