import { Paste } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import authGuard from '../../../guards/auth';
import rateLimitGuard from '../../../guards/rateLimit';
import withGuard from '../../../utils/guard';
import withMethod from '../../../utils/method';
import prisma from '../../../utils/prisma';
import { getCurrentUser } from '../auth/current';

export type GetPastesResponse = {
  status: 'error' | 'success';
  msg: string;
  pastes: Paste[];
};

const getAllPastes = async (req: NextApiRequest, res: NextApiResponse<GetPastesResponse>) => {
  const currentUser = (await getCurrentUser(req))!;
  const pastes = await prisma.paste.findMany({
    where: {
      authorId: currentUser.id,
    },
    orderBy: [{ updatedAt: 'desc' }],
  });
  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Fetched pastes successfully.',
    pastes,
  });
};

export default withGuard(
  withMethod({
    GET: getAllPastes,
  }),
  [rateLimitGuard, authGuard]
);
