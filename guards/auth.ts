import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/jwt';

const authGuard = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) {
    res.status(StatusCodes.FORBIDDEN).json({ status: 'error', msg: 'Forbidden.' });
    return false;
  }
  try {
    await verifyToken(req.headers.authorization.split('Bearer ')[1]);
    return true;
  } catch {
    res.status(StatusCodes.FORBIDDEN).json({ status: 'error', msg: 'Forbidden.' });
    return false;
  }
};

export const getPayload = async (req: NextApiRequest): Promise<User | null> => {
  if (!req.headers.authorization) {
    return null;
  }

  try {
    return (await verifyToken(req.headers.authorization.split('Bearer ')[1])) as User;
  } catch {
    return null;
  }
};

export default authGuard;
