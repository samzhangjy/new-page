import { Paste, PasteType, User } from '@prisma/client';
import { check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import authGuard from '../../../guards/auth';
import methodGuard from '../../../guards/method';
import rateLimitGuard from '../../../guards/rateLimit';
import validationGuard from '../../../guards/validation';
import withGuard from '../../../utils/guard';
import prisma from '../../../utils/prisma';
import { getCurrrentUserId } from '../auth/current';

export const PASTE_TYPES = ['TEXT', 'VIDEO', 'IMAGE', 'FILE'] as const;

export type CreatePasteDto = {
  contents: string;
  type: PasteType;
  filename?: string;
  filesize?: number;
};

export interface CreatePasteRequest extends NextApiRequest {
  body: CreatePasteDto;
}

export type CreatePasteResponse = {
  status: 'error' | 'success';
  msg: string;
  paste: Paste & { author: User };
};

const createPaste = async (req: CreatePasteRequest, res: NextApiResponse<CreatePasteResponse>) => {
  const { contents, type, filename, filesize } = req.body;

  const paste = await prisma.paste.create({
    data: {
      contents,
      type,
      filename,
      filesize,
      authorId: await getCurrrentUserId(req),
    },
    include: {
      author: true,
    },
  });

  delete (paste.author as Partial<User>).password;

  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Paste created successfully',
    paste,
  });
};

export default withGuard(createPaste, [
  methodGuard('POST'),
  rateLimitGuard,
  authGuard,
  validationGuard([
    check('contents').isString(),
    check('type').isIn(PASTE_TYPES),
    check('filesize'),
    check('filename'),
  ]),
]);
