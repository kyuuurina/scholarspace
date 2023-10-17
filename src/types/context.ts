//This type is the context object of a user.

import type { NextApiRequest, NextApiResponse } from "next";

export type Context = {
  res: NextApiResponse;
  req: NextApiRequest;
};
