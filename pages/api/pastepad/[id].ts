import { Paste, PasteType, User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import authGuard from '../../../guards/auth';
import rateLimitGuard from '../../../guards/rateLimit';
import withGuard from '../../../utils/guard';
import withMethod from '../../../utils/method';
import prisma from '../../../utils/prisma';
import { getCurrrentUserId } from '../auth/current';

export type GetPasteResponse = {
  status: 'success' | 'error';
  msg: string;
  paste?: Paste;
};

const getPaste = async (req: NextApiRequest, res: NextApiResponse<GetPasteResponse>) => {
  const paste = await prisma.paste.findUnique({
    where: {
      id: parseInt(req.query.id as string, 10),
    },
    include: {
      author: true,
    },
  });

  if (!paste) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'error',
      msg: 'Cannot find paste with given id.',
    });
  }

  const currentUserId = await getCurrrentUserId(req);

  if (currentUserId !== paste.authorId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: 'error',
      msg: "You're not permitted to view this paste.",
    });
  }

  delete (paste.author as Partial<User>).password;

  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Paste fetched successfully.',
    paste,
  });
};

export type UpdatePasteDto = {
  contents?: string;
  type?: PasteType;
};

export interface UpdatePasteRequest extends NextApiRequest {
  body: UpdatePasteDto;
}

const updatePaste = async (req: UpdatePasteRequest, res: NextApiResponse<GetPasteResponse>) => {
  const paste = await prisma.paste.findUnique({
    where: {
      id: parseInt(req.query.id as string, 10),
    },
  });

  if (!paste) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'error',
      msg: 'Cannot find paste with given id.',
    });
  }

  const currentUserId = await getCurrrentUserId(req);

  if (currentUserId !== paste.authorId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: 'error',
      msg: "You're not permitted to update this paste.",
    });
  }

  const { contents, type } = req.body;

  const updatedPaste = await prisma.paste.update({
    where: {
      id: paste.id,
    },
    data: {
      contents: contents ?? paste.contents,
      type: type ?? paste.type,
    },
    include: {
      author: true,
    },
  });

  delete (updatedPaste.author as Partial<User>).password;

  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Paste updated successfully.',
    paste: updatedPaste,
  });
};

const deletePaste = async (req: NextApiRequest, res: NextApiResponse<GetPasteResponse>) => {
  const paste = await prisma.paste.findUnique({
    where: {
      id: parseInt(req.query.id as string, 10),
    },
  });

  if (!paste) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'error',
      msg: 'Cannot find paste with given id.',
    });
  }

  const currentUserId = await getCurrrentUserId(req);

  if (currentUserId !== paste.authorId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: 'error',
      msg: "You're not permitted to view this paste.",
    });
  }

  await prisma.paste.delete({
    where: {
      id: paste.id,
    },
  });

  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Paste deleted successfully.',
    paste,
  });
};

export default withGuard(
  withMethod({
    GET: getPaste,
    PUT: updatePaste,
    DELETE: deletePaste,
  }),
  [rateLimitGuard, authGuard]
);
