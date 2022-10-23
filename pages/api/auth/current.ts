import { User } from '@prisma/client';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import authGuard, { getPayload } from '../../../guards/auth';
import rateLimitGuard from '../../../guards/rateLimit';
import withGuard from '../../../utils/guard';
import prisma from '../../../utils/prisma';

export type GetCurrentUserResponse = {
  status: 'success' | 'error';
  msg: string;
  user?: User;
};

const getCurrentUser = async (
  req: NextApiRequest,
  res: NextApiResponse<GetCurrentUserResponse>
) => {
  if (req.method !== 'GET') {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: 'error', msg: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED) });
  }
  const payload = (await getPayload(req))!;

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ status: 'error', msg: 'User with given token does not exist.' });
  }

  return res
    .status(StatusCodes.OK)
    .json({ status: 'success', msg: 'Fetched user successfully.', user });
};

export default withGuard(getCurrentUser, [rateLimitGuard, authGuard]);
