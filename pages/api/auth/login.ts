import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { check } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import methodGuard from '../../../guards/method';
import rateLimitGuard from '../../../guards/rateLimit';
import validationGuard from '../../../guards/validation';
import withGuard from '../../../utils/guard';
import { signToken } from '../../../utils/jwt';
import prisma from '../../../utils/prisma';

export type LoginDto = {
  email: string;
  password: string;
};

export interface LoginRequest extends NextApiRequest {
  body: LoginDto;
}

export type LoginResponse = {
  status: 'success' | 'error';
  msg: string;
  token?: string;
  user?: User;
};

const loginHandler = async (req: LoginRequest, res: NextApiResponse<LoginResponse>) => {
  const { email, password } = req.body;

  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!userWithPassword) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'error',
      msg: 'Cannot find user with given email.',
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, userWithPassword.password);

  if (!isPasswordValid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      msg: 'Wrong email or password',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userWithPassword.id,
    },
  });

  const token = await signToken(user!);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    msg: 'Login success',
    token,
    user: user!,
  });
};

export default withGuard(loginHandler, [
  rateLimitGuard,
  methodGuard('POST'),
  validationGuard([
    check('email').isEmail().isLength({ max: 50 }),
    check('password').isString().isLength({ max: 50 }),
  ]),
]);
