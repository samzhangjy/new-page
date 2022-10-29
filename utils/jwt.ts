import * as jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'secret';

export const signToken = (payload: object): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES,
      },
      (err, data) => {
        if (err || !data) {
          reject(new Error('Cannot generate access token.'));
        }
        resolve(data as string);
      }
    );
  });

export const verifyToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err || !data) {
        reject(err);
      }
      resolve(data);
    });
  });
