import { NextApiRequest, NextApiResponse } from 'next';

const indexHandler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ msg: 'Hello World!' });
};

export default indexHandler;
