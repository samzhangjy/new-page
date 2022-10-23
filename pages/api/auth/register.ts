import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { check } from 'express-validator';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import rateLimitGuard from '../../../guards/rateLimit';
import validationGuard from '../../../guards/validation';
import withGuard from '../../../utils/guard';
import { signToken } from '../../../utils/jwt';
import prisma from '../../../utils/prisma';

export type RegisterUserResponse = {
  status: 'success' | 'error';
  msg: string;
  user?: User;
  token?: string;
};

export type RegisterUserDto = {
  email: string;
  username: string;
  password: string;
};

export interface RegisterUserRequest extends NextApiRequest {
  body: RegisterUserDto;
}

const registerHandler = async (
  req: RegisterUserRequest,
  res: NextApiResponse<RegisterUserResponse>
) => {
  if (req.method !== 'POST') {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ status: 'error', msg: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED) });
  }
  const { email, username, password } = req.body;
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ status: 'error', msg: 'User registered with the same email already exists.' });
  }

  user = await prisma.user.create({
    data: {
      email,
      username,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    },
  });

  const token = await signToken(user);

  return res
    .status(StatusCodes.OK)
    .json({ status: 'success', msg: 'User created successfully', user, token });
};

export default withGuard(registerHandler, [
  rateLimitGuard,
  validationGuard([
    check('email').isEmail().isLength({ max: 50 }),
    check('username').isString().isLength({ min: 2, max: 20 }),
    check('password').isString().isLength({ min: 8, max: 50 }),
  ]),
]);
