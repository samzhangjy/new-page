import { ValidationChain, ValidationError, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';

const validationGuard =
  (validations: ValidationChain[]) => async (req: NextApiRequest, res: NextApiResponse) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errorFormatter = (err: ValidationError) => `Field '${err.param}': ${err.msg}.`;
    const errors = validationResult(req).formatWith(errorFormatter);
    if (errors.isEmpty()) {
      return true;
    }
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ status: 'error', msg: errors.array({ onlyFirstError: true })[0] });
    return false;
  };

export default validationGuard;
